# Task: info-server-types - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicSpecTypes.FeatureOpenapiTypes.TaskInfoServerTypes`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-openapi-types/task-info-server-types/task`

## Context

You are implementing OpenAPI 3.1 type definitions for document metadata. These are used when generating OpenAPI output from ContractedAPI specs.

## Your Task

Create `src/spec/openapi.ts` with info/server type definitions.

## Implementation

```typescript
// src/spec/openapi.ts

/**
 * OpenAPI 3.1 type definitions for generating OpenAPI output.
 * These define the target format, not the ContractedAPI source format.
 */

/** Contact information for the API. */
export type ContactObject = {
  name?: string;
  email?: string;
  url?: string;
};

/** License information for the API. */
export type LicenseObject = {
  name: string;
  url?: string;
};

/** API metadata. */
export type InfoObject = {
  title: string;
  version: string;
  description?: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;
};

/** Server variable for URL templating. */
export type ServerVariableObject = {
  enum?: string[];
  default: string;
  description?: string;
};

/** Server definition. */
export type ServerObject = {
  url: string;
  description?: string;
  variables?: Record<string, ServerVariableObject>;
};

/** Tag for grouping operations. */
export type TagObject = {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
};

/** External documentation reference. */
export type ExternalDocumentationObject = {
  url: string;
  description?: string;
};
```

## Commit Guidelines

- Single commit: `feat: add OpenAPI info and server types`

## Verification

```bash
deno check src/spec/openapi.ts
```
