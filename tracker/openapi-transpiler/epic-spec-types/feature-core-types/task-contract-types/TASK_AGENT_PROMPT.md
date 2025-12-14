# Task: contract-types - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-core-types/task-contract-types/task`

## Context

You are implementing the core Contract types for ContractedAPI.

## Your Task

Extend `src/spec/types.ts` with Contract types.

## Implementation

Add to `src/spec/types.ts`:

```typescript
import type { JSONSchema } from "../schema/mod.ts";
import type {
  RequestBodyObject,
  ResponseObject,
  SecurityRequirementObject,
  ParameterObject,
  ComponentsObject,
  HttpMethod,
} from "./openapi.ts";

/**
 * Minimal contract definition.
 *
 * Contracts are defined inline under `path.method` with named keys.
 */
export type Contract = {
  /** Request body schema (omit = no request body allowed). */
  request?: RequestBodyObject | JSONSchema;
  /** Response schema. */
  response?: ResponseObject | JSONSchema;
  /** WebSocket flag. */
  ws?: boolean;
  /** Error response schema. */
  error?: JSONSchema;
  /** Contract description. */
  description?: string;
  /** Grouping tags. */
  tags?: string[];
  /** Deprecation flag. */
  deprecated?: boolean;
  /** Security requirements. */
  security?: SecurityRequirementObject[];
  /** Additional parameters. */
  parameters?: ParameterObject[];
};

/**
 * External contract file (ContractCard).
 *
 * Loaded via glob patterns and merged into the spec.
 */
export type ContractCard = Contract & {
  /** Default path for this contract. */
  path: string;
  /** Default HTTP method. */
  method: HttpMethod;
  /** Contract name (colon:case recommended). */
  name: string;
  /** Local components to merge. */
  components?: ComponentsObject;
};

/**
 * Glob import pattern for ContractCards.
 *
 * @example "#./cards/*.yaml"
 */
export type ContractCardPath = `#${string}`;

/**
 * Type guard for ContractCardPath.
 */
export function isContractCardPath(value: string): value is ContractCardPath {
  return value.startsWith("#");
}
```

## Commit Guidelines

- Single commit: `feat: add Contract and ContractCard types`
