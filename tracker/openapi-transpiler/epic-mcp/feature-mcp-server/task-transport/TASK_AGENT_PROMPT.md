# Task: transport - Agent Prompt

> **Branch**: `openapi-transpiler/epic-mcp/feature-mcp-server/task-transport/task`

## Implementation
```typescript
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export async function runMcpServer(server: Server): Promise<void> {
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error('MCP server running on stdio');
}

// Main entry
export async function main(contracts: Contract[], options: McpServerOptions): Promise<void> {
  const server = createMcpServer(options);
  registerToolHandlers(server, contracts);
  await runMcpServer(server);
}
```

## Commit
`feat: add MCP stdio transport`
