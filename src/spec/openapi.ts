// src/spec/openapi.ts

import type { JSONSchema } from "../schema/mod.ts";

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

// Forward declarations for ComponentsObject (defined in next task)
// These are placeholder types that will be properly defined later
/** @internal Placeholder - full definition in task-request-response-types */
export type ResponseObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type ParameterObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type ExampleObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type RequestBodyObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type HeaderObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type SecuritySchemeObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type LinkObject = Record<string, unknown>;
/** @internal Placeholder - full definition in task-request-response-types */
export type CallbackObject = Record<string, unknown>;

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
