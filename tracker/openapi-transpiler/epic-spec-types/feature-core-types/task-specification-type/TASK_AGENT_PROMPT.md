# Task: specification-type - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureCoreTypes.TaskSpecificationType`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-core-types/task-specification-type/task`

## CRITICAL: Stay in Worktree

**ALL work must happen in the worktree location above.** If you ever run a CLI command that changes directories outside the worktree, immediately `cd` back to the worktree before continuing.

## Context

You are implementing the root Specification type for ContractedAPI. This type supports field aliases for familiarity with OpenAPI concepts.

The existing codebase has:
- `src/spec/openapi.ts` - OpenAPI 3.1 type definitions (InfoObject, ServerObject, etc.)
- `src/spec/helpers.ts` - Type guard for ReferenceObject
- `src/schema/types.ts` - JSONSchema types
- `src/schema/mod.ts` - Schema module exports

## Your Task

Create `src/spec/types.ts` with the Specification type.

**Important**: `SpecObject` and `EventsObject` will be defined in later tasks. For now, use `Record<string, unknown>` as a placeholder.

## Implementation

```typescript
// src/spec/types.ts

import type {
  InfoObject,
  ServerObject,
  ComponentsObject,
  SecurityRequirementObject,
  TagObject,
  ExternalDocumentationObject,
} from "./openapi.ts";

// Placeholder types - will be replaced in later tasks
// TODO: Replace with actual SpecObject when task-path-spec-types is complete
type SpecObject = Record<string, unknown>;
// TODO: Replace with actual EventsObject when task-events-module is complete
type EventsObject = Record<string, unknown>;

/**
 * ContractedAPI Specification root document.
 *
 * Supports field aliases for OpenAPI familiarity:
 * - `contractedapi` / `openapi` - version string
 * - `spec` / `paths` - route definitions
 * - `events` / `webhooks` - event definitions
 */
export type Specification = {
  /** ContractedAPI version (preferred). */
  contractedapi?: string;
  /** OpenAPI version alias. */
  openapi?: string;

  /** API metadata. */
  info?: InfoObject;

  /** Server definitions. */
  servers?: ServerObject[];

  /** Contract/route definitions (preferred). */
  spec?: SpecObject;
  /** Paths alias for OpenAPI familiarity. */
  paths?: SpecObject;

  /** Event definitions (preferred). */
  events?: EventsObject;
  /** Webhooks alias for OpenAPI familiarity. */
  webhooks?: EventsObject;

  /** Reusable components. */
  components?: ComponentsObject;

  /** Global security requirements. */
  security?: SecurityRequirementObject[];

  /** API tags. */
  tags?: TagObject[];

  /** External documentation. */
  externalDocs?: ExternalDocumentationObject;
};
```

## Verification

After implementing, run:
```bash
cd "C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureCoreTypes.TaskSpecificationType"
deno check src/spec/types.ts
```

## Commit Guidelines

- Single commit: `feat: add Specification root type`
- Commit message format:
  ```
  feat: add Specification root type

  - Specification type with field aliases for OpenAPI familiarity
  - Placeholder types for SpecObject and EventsObject (later tasks)
  ```

## Completion Signal

When done, report: "Work item complete - ready for PM review"
