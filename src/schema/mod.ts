// src/schema/mod.ts

/**
 * Schema types and utilities for ContractedAPI.
 *
 * @module
 */

// JSON serializable types
export type {
  JSONPrimitive,
  JSONArray,
  JSONObject,
  JSONValue,
  JSONSchema,
} from "./types.ts";

// Type inference from schemas
export type {
  FromSchema,
  FromSchemaOptions,
  FromSchemaDefaultOptions,
} from "./types.ts";
