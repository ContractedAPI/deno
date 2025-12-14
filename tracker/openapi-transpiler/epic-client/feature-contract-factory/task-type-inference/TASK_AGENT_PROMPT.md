# Task: type-inference - Agent Prompt

> **Branch**: `openapi-transpiler/epic-client/feature-contract-factory/task-type-inference/task`

## Implementation
```typescript
import type { FromSchema } from 'json-schema-to-ts';
import type { Contract } from '../types/core.ts';

export type InferRequest<T extends Contract> = T extends { request: infer R }
  ? FromSchema<R>
  : never;

export type InferResponse<T extends Contract> = T extends { response: infer R }
  ? FromSchema<R>
  : never;
```

## Commit
`feat: add contract type inference`
