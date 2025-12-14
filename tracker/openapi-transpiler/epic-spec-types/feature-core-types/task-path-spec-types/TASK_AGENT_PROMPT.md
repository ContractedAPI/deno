# Task: path-spec-types - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-core-types/task-path-spec-types/task`

## Context

You are implementing the routing structure types for ContractedAPI.

## Your Task

Extend `src/spec/types.ts` with path/spec types.

## Implementation

Add to `src/spec/types.ts`:

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

## Commit Guidelines

- Single commit: `feat: add path and spec structure types`
