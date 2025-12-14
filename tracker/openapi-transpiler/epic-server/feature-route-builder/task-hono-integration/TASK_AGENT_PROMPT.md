# Task: hono-integration - Agent Prompt

> **Branch**: `openapi-transpiler/epic-server/feature-route-builder/task-hono-integration/task`

## Implementation
```typescript
import { Hono } from 'hono';
import type { Contract } from '../types/core.ts';

export function createHonoApp(contracts: Contract[], handlers: Map<string, RouteHandler>): Hono {
  const app = new Hono();

  for (const contract of contracts) {
    const handler = handlers.get(contract.name);
    if (!handler) continue;

    const method = contract.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
    app[method](contract.path, handler);
  }

  return app;
}
```

## Commit
`feat: add Hono framework integration`
