# Task: component-types - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-openapi-types/task-component-types/task`

## Context

You are implementing OpenAPI component and reference types.

## Your Task

Extend `src/spec/openapi.ts` with component types.

## Implementation

Add to `src/spec/openapi.ts`:

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

// Note: ResponseObject, ParameterObject, etc. defined in next task
```

## Commit Guidelines

- Single commit: `feat: add OpenAPI component types`
