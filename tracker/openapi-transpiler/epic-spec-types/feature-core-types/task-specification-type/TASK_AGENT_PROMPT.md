# Task: specification-type - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-core-types/task-specification-type/task`

## Context

You are implementing the root Specification type for ContractedAPI. This type supports field aliases for familiarity with OpenAPI concepts.

## Your Task

Create `src/spec/types.ts` with the Specification type.

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

## Commit Guidelines

- Single commit: `feat: add Specification root type`
