# Epic: mcp

## Overview

Implement MCP (Model Context Protocol) tool generation and server integration from ContractedAPI specifications. The MCP epic provides:
1. **Tool schema generation** - Convert contracts to MCP tool definitions
2. **MCP server integration** - Stdio/SSE transport server setup
3. **Tool execution handlers** - Contract-to-HTTP execution bridge
4. **Response formatting** - LLM-friendly response transformation

The MCP epic enables AI assistants (Claude, ChatGPT, etc.) to interact with APIs defined by ContractedAPI specifications.

## Key Deliverables

### feature-tool-schema
- Contract to MCP tool schema mapping
- Tool name derivation from contract
- Input schema from request JSON Schema
- Description from contract description
- Required/optional parameter handling
- Enum and validation constraints

### feature-mcp-server
- MCP server initialization
- Stdio transport (for CLI integration)
- SSE transport (for web integration)
- Server lifecycle management
- Configuration options (name, version, capabilities)

### feature-tool-handlers
- Tool call routing to contracts
- HTTP client integration
- Path parameter interpolation
- Request body construction
- Response extraction
- Error handling and retries

### feature-response-formatter
- JSON to text transformation for LLM consumption
- Success/error response formatting
- Large response truncation
- Streaming response handling
- Structured output options

### feature-resource-provider
- MCP resource definitions from contracts
- API documentation as resources
- Schema inspection resources
- Health check resources

## File Structure

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

## Dependencies

### External
- **@modelcontextprotocol/sdk** - Official MCP SDK
- **zod** - Schema validation (MCP SDK dependency)

### Internal
- **epic-spec-types** (must be complete)
  - Contract type definitions
  - JSON Schema types
- **epic-loader** (must be complete)
  - Load specifications for tool generation
- **epic-transpiler** (must be complete)
  - Generated types for type-safe handlers
- **epic-client** (must be complete)
  - HTTP client for tool execution

## Dependents

- None (end-user facing component)

## Key Patterns

### Contract to Tool Mapping

```typescript
// Contract:
{
  name: "createUser",
  method: "POST",
  path: "/users",
  description: "Create a new user account",
  request: {
    type: "object",
    properties: {
      name: { type: "string", description: "User name" },
      email: { type: "string", format: "email" }
    },
    required: ["name", "email"]
  }
}

// MCP Tool:
{
  name: "createUser",
  description: "Create a new user account",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "User name" },
      email: { type: "string", format: "email" }
    },
    required: ["name", "email"]
  }
}
```

### Tool Execution Flow

```typescript
// 1. Receive tool call
const { name, arguments: args } = toolCall;

// 2. Find matching contract
const contract = contracts.find(c => c.name === name);

// 3. Build request
const url = interpolatePath(contract.path, args);
const body = extractBody(args, contract);

// 4. Execute HTTP request
const response = await client.request(contract.method, url, body);

// 5. Format response
return formatResponse(response, contract);
```

### Response Formatting

```typescript
// Raw JSON:
{
  "id": 123,
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}

// Formatted for LLM:
Successfully created user:
- ID: 123
- Name: Alice
- Email: alice@example.com
- Created: January 1, 2024
```
