# Task: contract-lookup - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-type-inference/task-contract-lookup/task`

## Context

You are implementing contract lookup utilities.

## Your Task

Create `src/schema/lookup.ts` with lookup types.

## Implementation

```typescript
// src/schema/lookup.ts

/**
 * Extract contract names from a contracts array.
 *
 * @example
 * ```typescript
 * const contracts = [
 *   { name: "user:list", ... },
 *   { name: "user:get", ... },
 * ] as const;
 *
 * type Names = ContractNames<typeof contracts>;
 * // "user:list" | "user:get"
 * ```
 */
export type ContractNames<Contracts extends readonly { name: string }[]> =
  Contracts[number]["name"];

/**
 * Find a contract by name from a contracts array.
 *
 * @example
 * ```typescript
 * type UserList = ContractByName<typeof contracts, "user:list">;
 * // { name: "user:list", ... }
 * ```
 */
export type ContractByName<
  Contracts extends readonly { name: string }[],
  Name extends Contracts[number]["name"]
> = Extract<Contracts[number], { name: Name }>;
```

## Commit Guidelines

- Single commit: `feat: add contract lookup types`
