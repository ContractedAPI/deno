# Task: schema-builder - Agent Prompt

> **Branch**: `openapi-transpiler/epic-mcp/feature-tool-schema/task-schema-builder/task`

## Implementation
```typescript
import type { Contract } from '../types/core.ts';

function extractPathParams(path: string): string[] {
  const matches = path.match(/\{(\w+)\}/g) || [];
  return matches.map(m => m.slice(1, -1));
}

export function contractToTool(contract: Contract): McpTool {
  const pathParams = extractPathParams(contract.path);
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  // Add path parameters
  for (const param of pathParams) {
    properties[param] = { type: 'string', description: `Path parameter: ${param}` };
    required.push(param);
  }

  // Merge request schema if present
  if (contract.request?.properties) {
    Object.assign(properties, contract.request.properties);
    if (contract.request.required) {
      required.push(...contract.request.required);
    }
  }

  return {
    name: contract.name,
    description: contract.description || `${contract.method} ${contract.path}`,
    inputSchema: { type: 'object', properties, required },
  };
}

export function contractsToTools(contracts: Contract[]): McpTool[] {
  return contracts.map(contractToTool);
}
```

## Commit
`feat: add contract-to-tool schema builder`
