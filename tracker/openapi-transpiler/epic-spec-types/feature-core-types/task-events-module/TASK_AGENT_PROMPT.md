# Task: events-module - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureCoreTypes.TaskEventsModule`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-core-types/task-events-module/task`

## Your Mission

Implement the final types for the core-types feature: EventsObject and EventDefinition. Then create the module entry point (mod.ts) with all public exports.

## Critical Rules

**Work Location:**
- **WORK ONLY in the task worktree** (path above)
- Navigate to worktree: `cd C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureCoreTypes.TaskEventsModule`
- **NEVER work in the base repo** at `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
- If you accidentally navigate elsewhere via CLI, return immediately to the worktree

**Commit Standards:**
- Read `.commitlintrc.yml` in the root project before committing
- Use micro-commits (~20-40 lines per commit)
- Follow format: `<type>: <description>` (e.g., `feat: add EventDefinition type`)

## Background: ContractedAPI Events

ContractedAPI events differ from OpenAPI webhooks in key ways:

**Fire-and-Maybe-Forget Semantics:**
- Response schema is **optional** (unlike webhooks which expect responses)
- Suitable for notifications, logs, analytics
- No guaranteed delivery

**Field Alias:**
- `events` (ContractedAPI preferred) / `webhooks` (OpenAPI alias)
- Both are valid; loader normalizes to `events`

## Implementation Steps

### Step 1: Replace EventsObject Placeholder

In `src/spec/types.ts`, **replace** the placeholder (lines 18-19):

```typescript
// REMOVE THIS:
// Placeholder types - will be replaced in later tasks
// TODO: Replace with actual EventsObject when task-events-module is complete
type EventsObject = Record<string, unknown>;
```

**Replace with:**

```typescript
/**
 * Event definition (fire-and-maybe-forget semantics).
 *
 * Unlike OpenAPI webhooks, ContractedAPI events have optional responses.
 * Suitable for notifications, logs, and analytics where delivery is not guaranteed.
 */
export type EventDefinition = {
  /** Event payload schema (JSON Schema). */
  payload?: JSONSchema;
  /** Optional response schema. Omit for fire-and-forget semantics. */
  response?: JSONSchema;
  /** Event description. */
  description?: string;
  /** Grouping tags. */
  tags?: string[];
};

/**
 * Events object mapping event names to definitions.
 *
 * Alias: `webhooks` for OpenAPI familiarity.
 */
export type EventsObject = Record<string, EventDefinition>;
```

**Commit:** `feat: add EventDefinition and EventsObject types`

### Step 2: Create Module Entry Point

Create new file `src/spec/mod.ts`:

```typescript
// src/spec/mod.ts

/**
 * ContractedAPI specification types.
 *
 * Provides types for ContractedAPI IDL documents and OpenAPI 3.1 output generation.
 *
 * @module
 */

// ============================================================================
// Core ContractedAPI types
// ============================================================================

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

// ============================================================================
// OpenAPI 3.1 types (for output generation)
// ============================================================================

export type {
  ContactObject,
  LicenseObject,
  InfoObject,
  ServerVariableObject,
  ServerObject,
  TagObject,
  ExternalDocumentationObject,
  ReferenceObject,
  HttpMethod,
  ParameterLocation,
  ParameterObject,
  MediaTypeObject,
  RequestBodyObject,
  ResponseObject,
  HeaderObject,
  ExampleObject,
  LinkObject,
  CallbackObject,
  SecuritySchemeObject,
  OAuthFlowsObject,
  OAuthFlowObject,
  SecurityRequirementObject,
  ComponentsObject,
  PathItemObject,
  OperationObject,
} from "./openapi.ts";

// ============================================================================
// Helpers
// ============================================================================

export { isReferenceObject } from "./helpers.ts";
```

**Commit:** `feat: create spec module entry point`

### Step 3: Verify

Run the following to ensure no TypeScript errors:

```bash
deno check src/spec/mod.ts
```

## Expected Outcomes

After completion:

1. `EventsObject` placeholder removed from `types.ts`
2. `EventDefinition` and `EventsObject` properly typed and exported
3. `src/spec/mod.ts` created with all public exports
4. All types compile under `strict: true`
5. 2 micro-commits following conventional style

## Files You'll Modify

- `src/spec/types.ts` (replace placeholder, add event types)
- `src/spec/mod.ts` (create new file)

## Signal Completion

When finished, respond with:

```
Task complete. Ready for PM review.

Files modified:
- src/spec/types.ts (added EventDefinition, EventsObject)
- src/spec/mod.ts (created module entry point)

Commits: 2
```
