# Task: json-types - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-schema-types/task-json-types/task`

## Context

You are implementing the foundational JSON serializable types for the ContractedAPI schema system. These types will be used throughout the project for type-safe JSON handling.

## Your Task

Create `src/schema/types.ts` with JSON serializable type definitions.

## Implementation

```typescript
// src/schema/types.ts

import type { JSONSchema as CoreJSONSchema } from "json-schema-to-ts";

/**
 * JSON primitive types that can be serialized.
 */
export type JSONPrimitive = string | number | boolean | null;

/**
 * JSON array type (recursive).
 */
export type JSONArray = JSONValue[];

/**
 * JSON object type with string keys.
 */
export type JSONObject = { [key: string]: JSONValue };

/**
 * Any valid JSON value.
 */
export type JSONValue = JSONPrimitive | JSONArray | JSONObject;

/**
 * JSON Schema type from json-schema-to-ts.
 */
export type JSONSchema = CoreJSONSchema;
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Single commit for this task: `feat: add JSON serializable types`

## Verification

```bash
deno check src/schema/types.ts
```

## Important Reminders

1. **Stay in your worktree**
2. **Verify with `deno check`** before committing
3. Ensure `json-schema-to-ts` is available (check deno.json imports)
