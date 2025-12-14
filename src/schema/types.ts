// src/schema/types.ts

import type {
  JSONSchema as CoreJSONSchema,
  FromSchema as CoreFromSchema,
  FromSchemaOptions,
  FromSchemaDefaultOptions,
} from "json-schema-to-ts";

/**
 * JSON primitive types that can be serialized.
 */
export type JSONPrimitive = string | number | boolean | null;

/**
 * JSON array type (recursive).
 */
export type JSONArray = JSONValue[];

/**
 * JSON object type with string keys.
 */
export type JSONObject = { [key: string]: JSONValue };

/**
 * Any valid JSON value.
 */
export type JSONValue = JSONPrimitive | JSONArray | JSONObject;

/**
 * JSON Schema type from json-schema-to-ts.
 */
export type JSONSchema = CoreJSONSchema;

// Re-export options types
export type { FromSchemaOptions, FromSchemaDefaultOptions };

/**
 * Type inference from JSON Schema with JSONObject correction.
 *
 * When the inferred type is an object, it is intersected with JSONObject
 * to ensure JSON serialization compatibility.
 */
export type FromSchema<
  SCHEMA extends JSONSchema,
  OPTIONS extends FromSchemaOptions = FromSchemaDefaultOptions
> = CoreFromSchema<SCHEMA, OPTIONS> extends { [x: string]: unknown }
  ? CoreFromSchema<SCHEMA, OPTIONS> & JSONObject
  : CoreFromSchema<SCHEMA, OPTIONS>;
