# Task: type-guards - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureOpenapiTypes.TaskTypeGuards`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-openapi-types/task-type-guards/task`

## Context

You are implementing type guards for OpenAPI types.

## Your Task

Create `src/spec/helpers.ts` with type guards.

## Implementation

```typescript
// src/spec/helpers.ts

import type { ReferenceObject } from "./openapi.ts";

/**
 * Type guard to check if a value is a ReferenceObject.
 *
 * @example
 * ```typescript
 * const value: JSONSchema | ReferenceObject = ...;
 * if (isReferenceObject(value)) {
 *   console.log(value.$ref); // Type narrowed to ReferenceObject
 * }
 * ```
 */
export function isReferenceObject(value: unknown): value is ReferenceObject {
  return (
    typeof value === "object" &&
    value !== null &&
    "$ref" in value &&
    typeof (value as ReferenceObject).$ref === "string"
  );
}
```

Also add to `src/spec/openapi.ts`:

```typescript
/** Path item object (placeholder, detailed in core-types). */
export type PathItemObject = {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  servers?: ServerObject[];
  parameters?: (ParameterObject | ReferenceObject)[];
};

/** Operation object (simplified). */
export type OperationObject = {
  operationId?: string;
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: (ParameterObject | ReferenceObject)[];
  requestBody?: RequestBodyObject | ReferenceObject;
  responses: Record<string, ResponseObject | ReferenceObject>;
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
};
```

## Commit Guidelines

- Single commit: `feat: add OpenAPI type guards`
