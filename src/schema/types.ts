// src/schema/types.ts

import type { JSONSchema as CoreJSONSchema } from "json-schema-to-ts";

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
