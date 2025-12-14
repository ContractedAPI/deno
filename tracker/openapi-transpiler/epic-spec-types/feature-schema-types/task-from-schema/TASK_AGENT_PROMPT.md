# Task: from-schema - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-schema-types/task-from-schema/task`

## Context

You are implementing the `FromSchema` wrapper that provides type inference from JSON Schema with a correction for object types. This is based on the pattern from the reference project.

## Your Task

Extend `src/schema/types.ts` with the FromSchema wrapper.

## Implementation

Add to `src/schema/types.ts`:

```typescript
import type {
  FromSchema as CoreFromSchema,
  FromSchemaOptions,
  FromSchemaDefaultOptions,
} from "json-schema-to-ts";

// Re-export options types
export type { FromSchemaOptions, FromSchemaDefaultOptions };

/**
 * Type inference from JSON Schema with JSONObject correction.
 *
 * When the inferred type is an object, it is intersected with JSONObject
 * to ensure JSON serialization compatibility.
 *
 * @example
 * ```typescript
 * const UserSchema = {
 *   type: 'object',
 *   properties: {
 *     id: { type: 'string' },
 *     name: { type: 'string' },
 *   },
 *   required: ['id', 'name'],
 * } as const;
 *
 * type User = FromSchema<typeof UserSchema>;
 * // { id: string; name: string } & JSONObject
 * ```
 */
export type FromSchema<
  SCHEMA extends JSONSchema,
  OPTIONS extends FromSchemaOptions = FromSchemaDefaultOptions
> = CoreFromSchema<SCHEMA, OPTIONS> extends { [x: string]: unknown }
  ? CoreFromSchema<SCHEMA, OPTIONS> & JSONObject
  : CoreFromSchema<SCHEMA, OPTIONS>;
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Single commit: `feat: add FromSchema wrapper with JSONObject correction`

## Verification

```bash
deno check src/schema/types.ts
```

## Important Reminders

1. **Stay in your worktree**
2. **Test with `as const`** - Type inference only works with const assertions
3. The conditional type checks for object-like results using `{ [x: string]: unknown }`
