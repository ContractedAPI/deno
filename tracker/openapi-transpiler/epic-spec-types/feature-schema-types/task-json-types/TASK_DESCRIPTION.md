# Task: json-types

## Overview

Implement JSON serializable base types that form the foundation for all schema work in ContractedAPI.

## Deliverables

- `JSONPrimitive` type (string, number, boolean, null)
- `JSONArray` type (recursive array of JSON values)
- `JSONObject` type (Record<string, JSONValue>)
- `JSONValue` union type (all JSON types)
- `JSONSchema` type alias (re-export from json-schema-to-ts)

## File Target

`src/schema/types.ts`

## Estimated Scope

~20-40 lines of type definitions
