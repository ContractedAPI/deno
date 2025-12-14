# Epic: mcp - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicMcp`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-mcp/epic`

## Context

You are working on MCP (Model Context Protocol) tool generation from ContractedAPI specifications. The MCP epic transforms contracts into tools that AI assistants can use to interact with APIs.

The MCP epic is an **end-user facing component** that enables AI-powered API interaction.

## Your Role at Epic Level

At the epic level, your responsibilities are:
1. Set up the MCP server infrastructure
2. Establish the contract-to-tool mapping pattern
3. Design the tool execution handler
4. Create response formatting for LLM consumption

**Individual features are implemented by dedicated feature-level agents.**

## Prerequisites

This epic depends on:
- **epic-spec-types** (must be complete) - Contract type definitions
- **epic-loader** (must be complete) - Load specifications for tool generation
- **epic-transpiler** (must be complete) - Generated types for type-safe handlers
- **epic-client** (must be complete) - HTTP client for tool execution

## Reference Project

The reference project at `C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator` does not include an MCP module. Design based on the official MCP SDK and contract structure.

**MCP SDK Documentation**: https://modelcontextprotocol.io/docs

**Remember**: After viewing reference files, return to your worktree.

## File Structure Target

```
src/mcp/
├── mod.ts              # Public exports
├── server.ts           # MCP server setup
├── tools/
│   ├── generate.ts     # Tool schema generation
│   ├── handler.ts      # Tool execution handler
│   └── types.ts        # Tool types
├── resources/
│   ├── generate.ts     # Resource generation
│   └── provider.ts     # Resource provider
├── transport/
│   ├── stdio.ts        # Stdio transport
│   └── sse.ts          # SSE transport
├── format/
│   ├── response.ts     # Response formatting
│   └── error.ts        # Error formatting
├── config.ts           # Server configuration
└── types.ts            # MCP types
```

## Key Patterns

### MCP Server Setup

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  {
    name: "contracted-api",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Register tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: generateTools(contracts) };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return await executeTool(request.params, contracts, client);
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Contract to Tool Mapping

```typescript
interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: "object";
    properties: Record<string, JSONSchema>;
    required?: string[];
  };
}

function contractToTool(contract: EndpointContract): MCPTool {
  return {
    name: contract.name ?? contract.operationId ?? deriveToolName(contract),
    description: contract.description,
    inputSchema: buildInputSchema(contract),
  };
}

function buildInputSchema(contract: EndpointContract): MCPTool["inputSchema"] {
  const properties: Record<string, JSONSchema> = {};
  const required: string[] = [];

  // Add path parameters
  for (const param of extractPathParams(contract.path)) {
    properties[param] = { type: "string", description: `Path parameter: ${param}` };
    required.push(param);
  }

  // Add request body properties
  if (contract.request?.properties) {
    Object.assign(properties, contract.request.properties);
    if (contract.request.required) {
      required.push(...contract.request.required);
    }
  }

  return { type: "object", properties, required };
}
```

### Tool Execution Handler

```typescript
async function executeTool(
  params: { name: string; arguments?: Record<string, unknown> },
  contracts: EndpointContract[],
  client: Client
): Promise<CallToolResult> {
  const contract = contracts.find(c => (c.name ?? c.operationId) === params.name);
  if (!contract) {
    return {
      content: [{ type: "text", text: `Unknown tool: ${params.name}` }],
      isError: true,
    };
  }

  try {
    // Interpolate path parameters
    const path = interpolatePath(contract.path, params.arguments ?? {});

    // Execute request
    const response = await client.request(
      contract.method,
      path,
      extractBody(params.arguments, contract)
    );

    // Format response
    return {
      content: [{ type: "text", text: formatResponse(response) }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: formatError(error) }],
      isError: true,
    };
  }
}
```

### Response Formatting

```typescript
function formatResponse(data: unknown): string {
  if (data === null || data === undefined) {
    return "Operation completed successfully (no response data)";
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return "Empty result set";
    return `Found ${data.length} items:\n${data.map(formatItem).join("\n")}`;
  }

  if (typeof data === "object") {
    return formatObject(data as Record<string, unknown>);
  }

  return String(data);
}

function formatObject(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .map(([key, value]) => `- ${key}: ${formatValue(value)}`)
    .join("\n");
}
```

### Path Parameter Interpolation

```typescript
function interpolatePath(
  path: string,
  args: Record<string, unknown>
): string {
  return path.replace(/\{([^}]+)\}/g, (_, param) => {
    const value = args[param];
    if (value === undefined) {
      throw new Error(`Missing required path parameter: ${param}`);
    }
    return encodeURIComponent(String(value));
  });
}
```

## MCP Protocol Reference

### Tool Definition Schema

```typescript
{
  name: string;           // Unique tool identifier
  description?: string;   // Human-readable description
  inputSchema: {          // JSON Schema for input
    type: "object";
    properties: Record<string, JSONSchema>;
    required?: string[];
  };
}
```

### Tool Call Result

```typescript
{
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;  // base64 for images
    mimeType?: string;
  }>;
  isError?: boolean;
}
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines
- Format: `type: description` (feat, fix, docs, refactor, chore)

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Don't implement features** - Focus on epic-level coordination
4. **Check the checklist** - Refer to [EPIC_CHECKLIST.md](./EPIC_CHECKLIST.md)
5. **Study MCP SDK** - Understand the protocol and SDK patterns
6. **Consider LLM UX** - Responses should be readable by AI assistants
