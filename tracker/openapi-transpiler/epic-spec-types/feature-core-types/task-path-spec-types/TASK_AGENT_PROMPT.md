# Task: path-spec-types - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureCoreTypes.TaskPathSpecTypes`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-core-types/task-path-spec-types/task`

## CRITICAL: Stay in Worktree

**ALL work must happen in the worktree location above.** If you ever run a CLI command that changes directories outside the worktree, immediately `cd` back to the worktree before continuing.

## Context

You are implementing the routing structure types for ContractedAPI. This is the third task in the feature-core-types feature.

The existing `src/spec/types.ts` already contains:
- `Specification` type from task-specification-type
- `Contract`, `ContractCard`, `ContractCardPath`, and `isContractCardPath` from task-contract-types

## Your Task

Extend `src/spec/types.ts` with path/spec types.

## Implementation

Add the following types to `src/spec/types.ts` after the existing types. Also **replace the placeholder `SpecObject`** with the real implementation:

1. **Remove the placeholder `SpecObject`** near the top of the file:
```typescript
// TODO: Replace with actual SpecObject when task-path-spec-types is complete
type SpecObject = Record<string, unknown>;
```

2. **Add the following types after `isContractCardPath`**:
```typescript
/**
 * Collection of named contracts under a method.
 *
 * Keys are contract names (colon:case recommended).
 */
export type ContractCollection = Record<string, Contract>;

/**
 * Method object containing contracts or glob imports.
 */
export type MethodObject = ContractCollection | ContractCardPath;

/**
 * Path item containing HTTP methods.
 *
 * Can also be a glob pattern for ContractCard imports.
 */
export type PathItemObject = {
  /** Path-level parameters. */
  parameters?: ParameterObject[];
  /** Path summary. */
  summary?: string;
  /** Path description. */
  description?: string;
  /** GET method contracts. */
  get?: MethodObject;
  /** POST method contracts. */
  post?: MethodObject;
  /** PUT method contracts. */
  put?: MethodObject;
  /** PATCH method contracts. */
  patch?: MethodObject;
  /** DELETE method contracts. */
  delete?: MethodObject;
  /** HEAD method contracts. */
  head?: MethodObject;
  /** OPTIONS method contracts. */
  options?: MethodObject;
  /** TRACE method contracts. */
  trace?: MethodObject;
} | ContractCardPath;

/**
 * Spec object mapping paths to path items.
 *
 * Keys are path patterns (e.g., "/users/{id}") or glob patterns.
 */
export type SpecObject = Record<string, PathItemObject>;
```

## Verification

After implementing, run:
```bash
cd "C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureCoreTypes.TaskPathSpecTypes"
deno check src/spec/types.ts
```

## Commit Guidelines

- Single commit: `feat: add path and spec structure types`
- Commit message format:
  ```
  feat: add path and spec structure types

  - ContractCollection type for named contracts
  - MethodObject type for contracts or glob imports
  - PathItemObject type for HTTP methods
  - SpecObject type mapping paths to path items
  - Replaced placeholder SpecObject with real implementation
  ```

## Completion Signal

When done, report: "Work item complete - ready for PM review"
