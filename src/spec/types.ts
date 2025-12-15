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
