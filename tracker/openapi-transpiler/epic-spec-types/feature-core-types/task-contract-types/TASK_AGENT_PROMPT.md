# Task: contract-types - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureCoreTypes.TaskContractTypes`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-core-types/task-contract-types/task`

## CRITICAL: Stay in Worktree

**ALL work must happen in the worktree location above.** If you ever run a CLI command that changes directories outside the worktree, immediately `cd` back to the worktree before continuing.

## Context

You are implementing the core Contract types for ContractedAPI. This is the second task in the feature-core-types feature.

The existing `src/spec/types.ts` already contains the `Specification` type from task-specification-type.

## Your Task

Extend `src/spec/types.ts` with Contract types by adding imports and new type definitions.

## Implementation

Add the following to `src/spec/types.ts`:

1. **Add new imports** (merge with existing imports):
```typescript
import type { JSONSchema } from "../schema/mod.ts";
import type {
  InfoObject,
  ServerObject,
  ComponentsObject,
  SecurityRequirementObject,
  TagObject,
  ExternalDocumentationObject,
  RequestBodyObject,
  ResponseObject,
  ParameterObject,
  HttpMethod,
} from "./openapi.ts";
```

2. **Add the following types after the Specification type**:
```typescript
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

## Verification

After implementing, run:
```bash
cd "C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureCoreTypes.TaskContractTypes"
deno check src/spec/types.ts
```

## Commit Guidelines

- Single commit: `feat: add Contract and ContractCard types`
- Commit message format:
  ```
  feat: add Contract and ContractCard types

  - Contract type for inline contract definitions
  - ContractCard type for external contract files
  - ContractCardPath template literal type
  - isContractCardPath type guard function
  ```

## Completion Signal

When done, report: "Work item complete - ready for PM review"
