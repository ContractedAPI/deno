// src/spec/helpers.ts

import type { ReferenceObject } from "./openapi.ts";

/**
 * Type guard to check if a value is a ReferenceObject.
 *
 * @example
 * ```typescript
 * const value: JSONSchema | ReferenceObject = ...;
 * if (isReferenceObject(value)) {
 *   console.log(value.$ref); // Type narrowed to ReferenceObject
 * }
 * ```
 */
export function isReferenceObject(value: unknown): value is ReferenceObject {
  return (
    typeof value === "object" &&
    value !== null &&
    "$ref" in value &&
    typeof (value as ReferenceObject).$ref === "string"
  );
}
