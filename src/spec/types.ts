// src/spec/types.ts

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

// Placeholder types - will be replaced in later tasks
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

/**
 * Collection of named contracts under a method.
 *
 * Keys are contract names (colon:case recommended).
 */
export type ContractCollection = Record<string, Contract>;

/**
 * Method object containing contracts or glob imports.
 */
export type MethodObject = ContractCollection | ContractCardPath;

/**
 * Path item containing HTTP methods.
 *
 * Can also be a glob pattern for ContractCard imports.
 */
export type PathItemObject = {
  /** Path-level parameters. */
  parameters?: ParameterObject[];
  /** Path summary. */
  summary?: string;
  /** Path description. */
  description?: string;
  /** GET method contracts. */
  get?: MethodObject;
  /** POST method contracts. */
  post?: MethodObject;
  /** PUT method contracts. */
  put?: MethodObject;
  /** PATCH method contracts. */
  patch?: MethodObject;
  /** DELETE method contracts. */
  delete?: MethodObject;
  /** HEAD method contracts. */
  head?: MethodObject;
  /** OPTIONS method contracts. */
  options?: MethodObject;
  /** TRACE method contracts. */
  trace?: MethodObject;
} | ContractCardPath;

/**
 * Spec object mapping paths to path items.
 *
 * Keys are path patterns (e.g., "/users/{id}") or glob patterns.
 */
export type SpecObject = Record<string, PathItemObject>;
