# Task: executor - Agent Prompt

> **Branch**: `openapi-transpiler/epic-mcp/feature-tool-handlers/task-executor/task`

## Implementation
```typescript
import type { Contract } from '../types/core.ts';

function interpolatePath(path: string, args: Record<string, unknown>): string {
  return path.replace(/\{(\w+)\}/g, (_, key) => String(args[key] ?? ''));
}

function extractBodyParams(args: Record<string, unknown>, pathParams: string[]): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(args)) {
    if (!pathParams.includes(key)) {
      body[key] = value;
    }
  }
  return body;
}

export async function executeTool(
  contract: Contract,
  args: Record<string, unknown>,
  baseUrl: string
): Promise<unknown> {
  const pathParams = (contract.path.match(/\{(\w+)\}/g) || []).map(m => m.slice(1, -1));
  const path = interpolatePath(contract.path, args);
  const body = extractBodyParams(args, pathParams);

  const response = await fetch(`${baseUrl}${path}`, {
    method: contract.method,
    headers: { 'Content-Type': 'application/json' },
    body: Object.keys(body).length ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
```

## Commit
`feat: add MCP tool executor`
