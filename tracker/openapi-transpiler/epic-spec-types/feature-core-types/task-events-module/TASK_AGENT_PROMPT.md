# Task: events-module - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-core-types/task-events-module/task`

## Context

You are implementing event types and creating the module exports.

## Your Task

1. Add event types to `src/spec/types.ts`
2. Create `src/spec/mod.ts`

## Implementation

Add to `src/spec/types.ts`:

```typescript
/**
 * Event definition (fire-and-maybe-forget semantics).
 *
 * Unlike OpenAPI webhooks, response is optional.
 */
export type EventDefinition = {
  /** Event payload schema. */
  payload?: JSONSchema;
  /** Optional response schema (fire-and-maybe-forget if omitted). */
  response?: JSONSchema;
  /** Event description. */
  description?: string;
  /** Grouping tags. */
  tags?: string[];
};

/**
 * Events object mapping event names to definitions.
 */
export type EventsObject = Record<string, EventDefinition>;
```

Create `src/spec/mod.ts`:

```typescript
// src/spec/mod.ts

/**
 * ContractedAPI specification types.
 *
 * @module
 */

// Core ContractedAPI types
export type {
  Specification,
  Contract,
  ContractCard,
  ContractCardPath,
  ContractCollection,
  MethodObject,
  PathItemObject,
  SpecObject,
  EventDefinition,
  EventsObject,
} from "./types.ts";

export { isContractCardPath } from "./types.ts";

// OpenAPI types (for output generation)
export type {
  InfoObject,
  ServerObject,
  ComponentsObject,
  ReferenceObject,
  HttpMethod,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
  // ... other types
} from "./openapi.ts";

// Helpers
export { isReferenceObject } from "./helpers.ts";
```

## Commit Guidelines

- Single commit: `feat: add events types and module exports`
