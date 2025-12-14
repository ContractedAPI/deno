# Task: middleware - Agent Prompt

> **Branch**: `openapi-transpiler/epic-server/feature-validation/task-middleware/task`

## Implementation
```typescript
import type { Contract } from '../types/core.ts';
import type { Context, Next } from 'hono';

export function findMatchingContract(body: unknown, contracts: Contract[]): Contract | null {
  for (const contract of contracts) {
    if (!contract.request) continue;
    const result = validate(body, contract.request);
    if (result.valid) return contract;
  }
  return null;
}

export function validationMiddleware(contracts: Contract[]) {
  return async (ctx: Context, next: Next) => {
    const body = await ctx.req.json().catch(() => null);
    const contract = findMatchingContract(body, contracts);

    if (!contract) {
      return ctx.json({ error: 'Invalid request body' }, 400);
    }

    ctx.set('contract', contract);
    return next();
  };
}
```

## Commit
`feat: add validation middleware`
