# Task: resource-handler - Agent Prompt

> **Branch**: `openapi-transpiler/epic-mcp/feature-resource-provider/task-resource-handler/task`

## Implementation
```typescript
import type { Server } from '@modelcontextprotocol/sdk/server/index.js';
import type { Contract } from '../types/core.ts';

export function listResources(contracts: Contract[]): McpResource[] {
  const resources: McpResource[] = [
    { uri: 'api://docs', name: 'API Documentation', mimeType: 'text/markdown' },
  ];

  for (const contract of contracts) {
    resources.push({
      uri: `api://contracts/${contract.name}`,
      name: contract.name,
      description: `${contract.method} ${contract.path}`,
      mimeType: 'application/json',
    });
  }

  return resources;
}

export function readResource(uri: string, contracts: Contract[]): ResourceContent {
  if (uri === 'api://docs') {
    return { uri, mimeType: 'text/markdown', text: generateDocs(contracts) };
  }

  const match = uri.match(/^api:\/\/contracts\/(.+)$/);
  if (match) {
    const contract = contracts.find(c => c.name === match[1]);
    if (contract) {
      return { uri, mimeType: 'application/json', text: JSON.stringify(contract, null, 2) };
    }
  }

  throw new Error(`Unknown resource: ${uri}`);
}

export function registerResourceHandlers(server: Server, contracts: Contract[]): void {
  server.setRequestHandler('resources/list', async () => ({
    resources: listResources(contracts),
  }));

  server.setRequestHandler('resources/read', async (request) => ({
    contents: [readResource(request.params.uri, contracts)],
  }));
}
```

## Commit
`feat: add MCP resource handlers`
