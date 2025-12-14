# Task: contract-extractors - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-type-inference/task-contract-extractors/task`

## Context

You are implementing type extraction helpers for contracts.

## Your Task

Create `src/schema/inference.ts` with type extractors.

## Implementation

```typescript
// src/schema/inference.ts

import type { FromSchema, JSONSchema } from "./types.ts";
import type { Contract } from "../spec/types.ts";

/**
 * Extract the request type from a contract.
 *
 * Returns `undefined` if the contract has no request schema.
 */
export type ContractRequest<C extends Contract> =
  C["request"] extends JSONSchema
    ? FromSchema<C["request"]>
    : undefined;

/**
 * Extract the response type from a contract.
 *
 * Returns `undefined` if the contract has no response schema.
 */
export type ContractResponse<C extends Contract> =
  C["response"] extends JSONSchema
    ? FromSchema<C["response"]>
    : undefined;

/**
 * Extract the error type from a contract.
 *
 * Returns `undefined` if the contract has no error schema.
 */
export type ContractError<C extends Contract> =
  C["error"] extends JSONSchema
    ? FromSchema<C["error"]>
    : undefined;
```

## Commit Guidelines

- Single commit: `feat: add contract type extractors`
