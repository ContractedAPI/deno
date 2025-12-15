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
