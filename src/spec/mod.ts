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
  OperationObject,
} from "./openapi.ts";

// ============================================================================
// Helpers
// ============================================================================

export { isReferenceObject } from "./helpers.ts";
