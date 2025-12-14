# Task: server-setup - Agent Prompt

> **Branch**: `openapi-transpiler/epic-mcp/feature-mcp-server/task-server-setup/task`

## Implementation
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

export interface McpServerOptions {
  name: string;
  version: string;
}

export function createMcpServer(options: McpServerOptions): Server {
  const server = new Server(
    { name: options.name, version: options.version },
    { capabilities: { tools: {} } }
  );

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  return server;
}
```

## Commit
`feat: add MCP server setup`
