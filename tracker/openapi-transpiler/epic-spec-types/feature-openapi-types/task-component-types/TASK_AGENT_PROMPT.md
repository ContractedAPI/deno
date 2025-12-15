# Task: component-types - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureOpenapiTypes.TaskComponentTypes`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-openapi-types/task-component-types/task`

**IMPORTANT**: You are working in the worktree above. If you use CLI commands that change directories, ALWAYS navigate back to the worktree before continuing work.

## Context

You are implementing OpenAPI component and reference types. This extends the existing `src/spec/openapi.ts` file created in the previous task.

## Your Task

Extend `src/spec/openapi.ts` with ReferenceObject, HttpMethod, and ComponentsObject types.

## Implementation

Add the following to the END of `src/spec/openapi.ts` (after the existing types):

```typescript
import type { JSONSchema } from "../schema/mod.ts";

/** JSON Reference object for $ref pointers. */
export type ReferenceObject = {
  $ref: string;
};

/** HTTP methods supported by OpenAPI. */
export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "head"
  | "options"
  | "trace";

// Forward declarations for ComponentsObject (defined in next task)
// These are placeholder types that will be properly defined later
/** @internal Placeholder - full definition in task-request-response-types */
export type ResponseObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type ParameterObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type ExampleObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type RequestBodyObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type HeaderObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type SecuritySchemeObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type LinkObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type CallbackObject = Record<string, unknown>;

/** Reusable components container. */
export type ComponentsObject = {
  schemas?: Record<string, JSONSchema | ReferenceObject>;
  responses?: Record<string, ResponseObject | ReferenceObject>;
  parameters?: Record<string, ParameterObject | ReferenceObject>;
  examples?: Record<string, ExampleObject | ReferenceObject>;
  requestBodies?: Record<string, RequestBodyObject | ReferenceObject>;
  headers?: Record<string, HeaderObject | ReferenceObject>;
  securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject>;
  links?: Record<string, LinkObject | ReferenceObject>;
  callbacks?: Record<string, CallbackObject | ReferenceObject>;
};
```

**Note**: The import statement should be added at the TOP of the file (before the module comment).

## Steps

1. Add `import type { JSONSchema } from "../schema/mod.ts";` at the top of `src/spec/openapi.ts`
2. Add the type definitions above at the end of the file
3. Verify with: `deno check src/spec/openapi.ts`
4. Commit with message: `feat: add OpenAPI component types`

## Commit Guidelines

- Single commit: `feat: add OpenAPI component types`

## Verification

```bash
deno check src/spec/openapi.ts
```
