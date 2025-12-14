# Task: binding-types - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-type-inference/task-binding-types/task`

## Context

You are implementing binding types that enforce complete implementations.

## Your Task

1. Extend `src/schema/lookup.ts`
2. Update `src/schema/mod.ts`

## Implementation

Add to `src/schema/lookup.ts`:

```typescript
/**
 * Create a mapped type requiring all contract names as keys.
 *
 * @example
 * ```typescript
 * type Handlers = ContractBinding<typeof contracts, Handler>;
 * // { "user:list": Handler; "user:get": Handler; ... }
 * ```
 */
export type ContractBinding<
  Contracts extends readonly { name: string }[],
  T
> = {
  [K in ContractNames<Contracts>]: T;
};

/**
 * Registry mapping contract names to handler functions.
 */
export type ContractRegistry<
  Contracts extends readonly { name: string }[]
> = ContractBinding<Contracts, (...args: unknown[]) => unknown>;
```

Update `src/schema/mod.ts`:

```typescript
// Add to existing exports:

// Type inference
export type {
  ContractRequest,
  ContractResponse,
  ContractError,
} from "./inference.ts";

// Contract lookup
export type {
  ContractNames,
  ContractByName,
  ContractBinding,
  ContractRegistry,
} from "./lookup.ts";
```

## Commit Guidelines

- Single commit: `feat: add binding types and update exports`
