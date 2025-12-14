# Task: dispatcher - Agent Prompt

> **Branch**: `openapi-transpiler/epic-mcp/feature-tool-handlers/task-dispatcher/task`

## Implementation
```typescript
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { Contract } from '../types/core.ts';

export function findContract(name: string, contracts: Contract[]): Contract | undefined {
  return contracts.find(c => c.name === name);
}

export function registerToolHandlers(server: Server, contracts: Contract[]): void {
  const tools = contractsToTools(contracts);

  server.setRequestHandler('tools/list', async () => ({
    tools,
  }));

  server.setRequestHandler('tools/call', async (request) => {
    const { name, arguments: args } = request.params;
    const contract = findContract(name, contracts);

    if (!contract) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const result = await executeTool(contract, args);
    return { content: [{ type: 'text', text: formatResponse(result) }] };
  });
}
```

## Commit
`feat: add MCP tool dispatcher`
