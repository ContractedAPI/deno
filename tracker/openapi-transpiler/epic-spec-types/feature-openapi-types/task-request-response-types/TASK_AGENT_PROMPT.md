# Task: request-response-types - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/feature-openapi-types/task-request-response-types/task`

## Context

You are implementing OpenAPI request/response types for generating OpenAPI output.

## Your Task

Extend `src/spec/openapi.ts` with request/response types.

## Implementation

Add to `src/spec/openapi.ts`:

```typescript
/** Parameter location. */
export type ParameterLocation = "path" | "query" | "header" | "cookie";

/** Parameter definition. */
export type ParameterObject = {
  name: string;
  in: ParameterLocation;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: JSONSchema | ReferenceObject;
  example?: unknown;
};

/** Media type definition. */
export type MediaTypeObject = {
  schema?: JSONSchema | ReferenceObject;
  example?: unknown;
  examples?: Record<string, ExampleObject | ReferenceObject>;
};

/** Request body definition. */
export type RequestBodyObject = {
  description?: string;
  required?: boolean;
  content: Record<string, MediaTypeObject>;
};

/** Response definition. */
export type ResponseObject = {
  description: string;
  headers?: Record<string, HeaderObject | ReferenceObject>;
  content?: Record<string, MediaTypeObject>;
  links?: Record<string, LinkObject | ReferenceObject>;
};

/** Header definition. */
export type HeaderObject = Omit<ParameterObject, "name" | "in">;

/** Example definition. */
export type ExampleObject = {
  summary?: string;
  description?: string;
  value?: unknown;
  externalValue?: string;
};

/** Link definition. */
export type LinkObject = {
  operationRef?: string;
  operationId?: string;
  parameters?: Record<string, unknown>;
  requestBody?: unknown;
  description?: string;
};

/** Callback definition. */
export type CallbackObject = Record<string, PathItemObject>;

/** Security scheme definition. */
export type SecuritySchemeObject = {
  type: "apiKey" | "http" | "oauth2" | "openIdConnect";
  description?: string;
  name?: string;
  in?: "query" | "header" | "cookie";
  scheme?: string;
  bearerFormat?: string;
  flows?: OAuthFlowsObject;
  openIdConnectUrl?: string;
};

/** OAuth flows. */
export type OAuthFlowsObject = {
  implicit?: OAuthFlowObject;
  password?: OAuthFlowObject;
  clientCredentials?: OAuthFlowObject;
  authorizationCode?: OAuthFlowObject;
};

/** OAuth flow. */
export type OAuthFlowObject = {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: Record<string, string>;
};

/** Security requirement. */
export type SecurityRequirementObject = Record<string, string[]>;
```

## Commit Guidelines

- Single commit: `feat: add OpenAPI request/response types`
