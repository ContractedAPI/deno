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

/** Callback definition (PathItemObject not yet defined, using placeholder). */
export type CallbackObject = Record<string, Record<string, unknown>>;

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
