# Epic: mcp - Research

## MCP Protocol Overview

The Model Context Protocol (MCP) is a standard for connecting AI assistants to external tools and data sources. Key concepts:

- **Tools**: Functions the AI can call (like our API endpoints)
- **Resources**: Data the AI can read (like API documentation)
- **Prompts**: Reusable prompt templates (not used in this epic)
- **Sampling**: Request LLM completions (not used in this epic)

## MCP SDK Architecture

### Server Components

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
```

### Server Initialization

```typescript
const server = new Server(
  {
    name: "my-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},      // Enable tools capability
      resources: {},  // Enable resources capability
    },
  }
);
```

### Request Handlers

```typescript
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "my_tool",
        description: "Does something",
        inputSchema: {
          type: "object",
          properties: {
            param: { type: "string" }
          },
          required: ["param"]
        }
      }
    ]
  };
});

// Execute a tool call
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  // Execute and return result
  return {
    content: [
      { type: "text", text: "Result here" }
    ]
  };
});
```

### Transport Layer

```typescript
// Stdio transport (for CLI)
const transport = new StdioServerTransport();
await server.connect(transport);

// SSE transport (for web) - requires additional setup
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
const sseTransport = new SSEServerTransport("/sse", response);
```

## Contract to Tool Mapping

### Tool Name Derivation

Priority order:
1. `contract.name` (ContractedAPI contract name)
2. `contract.operationId` (optional, derived from OpenAPI concepts)
3. Derived from method + path: `listUsers`, `createUser`, etc.

```typescript
function deriveToolName(contract: EndpointContract): string {
  if (contract.name) return contract.name;
  if (contract.operationId) return contract.operationId;

  // Derive from method + path
  const method = contract.method.toLowerCase();
  const segments = contract.path.split("/").filter(s => s && !s.startsWith("{"));
  const resource = segments[segments.length - 1] || "resource";

  const methodPrefix: Record<string, string> = {
    get: contract.path.includes("{") ? "get" : "list",
    post: "create",
    put: "update",
    patch: "patch",
    delete: "delete",
  };

  return `${methodPrefix[method] || method}${pascalCase(resource)}`;
}
```

### Input Schema Construction

Combine path parameters and request body into a single input schema:

```typescript
function buildInputSchema(contract: EndpointContract): JSONSchema {
  const properties: Record<string, JSONSchema> = {};
  const required: string[] = [];

  // 1. Path parameters (always required)
  const pathParams = extractPathParams(contract.path);
  for (const param of pathParams) {
    properties[param] = {
      type: "string",
      description: `Path parameter: ${param}`,
    };
    required.push(param);
  }

  // 2. Query parameters (for GET requests)
  if (contract.method.toUpperCase() === "GET" && contract.request) {
    mergeSchemaProperties(properties, required, contract.request);
  }

  // 3. Body parameters (for POST/PUT/PATCH)
  if (["POST", "PUT", "PATCH"].includes(contract.method.toUpperCase())) {
    if (contract.request) {
      mergeSchemaProperties(properties, required, contract.request);
    }
  }

  return {
    type: "object",
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

function extractPathParams(path: string): string[] {
  const params: string[] = [];
  const regex = /\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(path)) !== null) {
    params.push(match[1]);
  }
  return params;
}
```

### Schema Transformation

JSON Schema to MCP input schema:

```typescript
function transformSchema(schema: JSONSchema): JSONSchema {
  // MCP expects JSON Schema Draft-07 compatible schemas
  const result = { ...schema };

  // Remove unsupported keywords
  delete result.$schema;
  delete result.$id;
  delete result.definitions;

  // Recursively transform nested schemas
  if (result.properties) {
    result.properties = Object.fromEntries(
      Object.entries(result.properties).map(([key, value]) => [
        key,
        transformSchema(value as JSONSchema),
      ])
    );
  }

  return result;
}
```

## Tool Execution

### Request Building

```typescript
interface ToolCallRequest {
  name: string;
  arguments?: Record<string, unknown>;
}

async function executeTool(
  request: ToolCallRequest,
  contracts: EndpointContract[],
  client: Client
): Promise<CallToolResult> {
  // Find contract
  const contract = findContractByToolName(contracts, request.name);
  if (!contract) {
    return errorResult(`Unknown tool: ${request.name}`);
  }

  const args = request.arguments ?? {};

  // Build URL with path params
  const url = interpolatePath(contract.path, args);

  // Extract body (non-path-param arguments)
  const pathParams = new Set(extractPathParams(contract.path));
  const body = Object.fromEntries(
    Object.entries(args).filter(([key]) => !pathParams.has(key))
  );

  // Execute request
  try {
    const response = await executeRequest(client, contract.method, url, body);
    return successResult(response);
  } catch (error) {
    return errorResult(error);
  }
}
```

### Path Interpolation

```typescript
function interpolatePath(
  template: string,
  params: Record<string, unknown>
): string {
  return template.replace(/\{([^}]+)\}/g, (_, name) => {
    const value = params[name];
    if (value === undefined) {
      throw new Error(`Missing path parameter: ${name}`);
    }
    return encodeURIComponent(String(value));
  });
}

// Example:
// interpolatePath("/users/{userId}/posts/{postId}", { userId: 123, postId: 456 })
// -> "/users/123/posts/456"
```

### HTTP Execution

```typescript
async function executeRequest(
  client: Client,
  method: string,
  path: string,
  body: Record<string, unknown>
): Promise<unknown> {
  const upperMethod = method.toUpperCase();

  switch (upperMethod) {
    case "GET":
      const query = new URLSearchParams(
        Object.entries(body)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      );
      const urlWithQuery = query.toString() ? `${path}?${query}` : path;
      return client.get(urlWithQuery);

    case "POST":
      return client.post(path, body);

    case "PUT":
      return client.put(path, body);

    case "PATCH":
      return client.patch(path, body);

    case "DELETE":
      return client.delete(path);

    default:
      throw new Error(`Unsupported method: ${method}`);
  }
}
```

## Response Formatting

### LLM-Friendly Output

AI assistants work best with structured, readable text:

```typescript
function formatResponse(data: unknown, contract?: EndpointContract): string {
  if (data === null || data === undefined) {
    return "Operation completed successfully.";
  }

  if (Array.isArray(data)) {
    return formatArray(data);
  }

  if (typeof data === "object") {
    return formatObject(data as Record<string, unknown>);
  }

  return String(data);
}

function formatArray(arr: unknown[]): string {
  if (arr.length === 0) {
    return "No results found.";
  }

  if (arr.length > 10) {
    const shown = arr.slice(0, 10);
    return [
      `Found ${arr.length} items (showing first 10):`,
      "",
      ...shown.map((item, i) => `${i + 1}. ${formatItem(item)}`),
      "",
      `... and ${arr.length - 10} more items.`,
    ].join("\n");
  }

  return [
    `Found ${arr.length} item${arr.length === 1 ? "" : "s"}:`,
    "",
    ...arr.map((item, i) => `${i + 1}. ${formatItem(item)}`),
  ].join("\n");
}

function formatObject(obj: Record<string, unknown>): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const formattedKey = formatKey(key);
    const formattedValue = formatValue(value);
    lines.push(`${formattedKey}: ${formattedValue}`);
  }

  return lines.join("\n");
}

function formatKey(key: string): string {
  // Convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "(not set)";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.length === 0 ? "(empty)" : value.join(", ");
    }
    return JSON.stringify(value);
  }

  // Format dates
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    try {
      return new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return value;
    }
  }

  return String(value);
}
```

### Error Formatting

```typescript
function formatError(error: unknown): string {
  if (error instanceof ResponseError) {
    return [
      `Request failed with status ${error.status}:`,
      error.message,
      "",
      "Please check the parameters and try again.",
    ].join("\n");
  }

  if (error instanceof Error) {
    return [
      "An error occurred:",
      error.message,
    ].join("\n");
  }

  return `An unexpected error occurred: ${String(error)}`;
}
```

### Result Types

```typescript
function successResult(data: unknown): CallToolResult {
  return {
    content: [
      { type: "text", text: formatResponse(data) },
    ],
  };
}

function errorResult(error: unknown): CallToolResult {
  const message = error instanceof Error
    ? formatError(error)
    : String(error);

  return {
    content: [
      { type: "text", text: message },
    ],
    isError: true,
  };
}
```

## MCP Resources

### API Documentation Resource

```typescript
const resources = [
  {
    uri: "api://documentation",
    name: "API Documentation",
    description: "Full API documentation",
    mimeType: "text/markdown",
  },
  {
    uri: "api://contracts",
    name: "Available Contracts",
    description: "List of all API contracts",
    mimeType: "application/json",
  },
];

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "api://documentation":
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: generateDocumentation(contracts),
          },
        ],
      };

    case "api://contracts":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(contracts, null, 2),
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});
```

### Dynamic Contract Resources

```typescript
// Generate resource for each contract
function generateContractResources(contracts: EndpointContract[]): Resource[] {
  return contracts.map((contract) => ({
    uri: `api://contracts/${contract.name ?? contract.operationId}`,
    name: contract.name ?? contract.operationId ?? "Unnamed",
    description: contract.description,
    mimeType: "application/json",
  }));
}
```

## Configuration

### Server Configuration

```typescript
interface MCPServerConfig {
  name: string;
  version: string;
  baseUrl: string;
  timeout?: number;
  maxResponseSize?: number;
  transport?: "stdio" | "sse";
}

const defaultConfig: MCPServerConfig = {
  name: "contracted-api",
  version: "1.0.0",
  baseUrl: "http://localhost:3000",
  timeout: 30000,
  maxResponseSize: 100000, // 100KB
  transport: "stdio",
};
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MCP_SERVER_NAME` | Server name | `contracted-api` |
| `MCP_BASE_URL` | API base URL | `http://localhost:3000` |
| `MCP_TIMEOUT` | Request timeout (ms) | `30000` |
| `MCP_TRANSPORT` | Transport type | `stdio` |

## Testing MCP Servers

### Manual Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector deno run --allow-all src/mcp/main.ts
```

### Automated Testing

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "deno",
  args: ["run", "--allow-all", "src/mcp/main.ts"],
});

const client = new Client({ name: "test-client", version: "1.0.0" }, {});
await client.connect(transport);

// List tools
const { tools } = await client.listTools();
console.log("Available tools:", tools.map(t => t.name));

// Call a tool
const result = await client.callTool({
  name: "listUsers",
  arguments: {},
});
console.log("Result:", result);
```

## Security Considerations

### Input Validation

Always validate tool arguments before execution:

```typescript
function validateArguments(
  args: Record<string, unknown>,
  schema: JSONSchema
): ValidationResult {
  // Use AJV or similar for schema validation
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(args);

  return {
    valid,
    errors: validate.errors ?? [],
  };
}
```

### Sensitive Data

- Never log request/response bodies in production
- Sanitize error messages to avoid leaking internal details
- Consider rate limiting for expensive operations

### URL Validation

```typescript
function validateBaseUrl(url: string): void {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP(S) URLs are allowed");
  }
}
```
