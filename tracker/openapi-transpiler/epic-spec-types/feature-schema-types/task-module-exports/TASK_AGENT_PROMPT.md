# Task: module-exports - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-schema-types/task-module-exports/task`

## Context

You are creating the public module exports for the schema types.

## Your Task

Create `src/schema/mod.ts` with all public exports.

## Implementation

```typescript
// src/schema/mod.ts

/**
 * Schema types and utilities for ContractedAPI.
 *
 * @module
 */

// JSON serializable types
export type {
  JSONPrimitive,
  JSONArray,
  JSONObject,
  JSONValue,
  JSONSchema,
} from "./types.ts";

// Type inference from schemas
export type {
  FromSchema,
  FromSchemaOptions,
  FromSchemaDefaultOptions,
} from "./types.ts";
```

## Commit Guidelines

- Single commit: `feat: add schema module exports`

## Verification

```bash
deno check src/schema/mod.ts
```
