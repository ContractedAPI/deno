# Feature: schema-types

## Overview

Implement JSON serializable types and the FromSchema wrapper for compile-time type inference from JSON Schema definitions.

## Key Deliverables

- JSON serializable types (`JSONPrimitive`, `JSONObject`, `JSONArray`, `JSONSerializable`)
- `FromSchema` wrapper with `& JSONObject` correction for object types
- Re-exports from `json-schema-to-ts`

## Files

- `src/schema/types.ts` - Type definitions
- `src/schema/mod.ts` - Public exports

## Dependencies

- **External**: `json-schema-to-ts` (^3.0.0)
- **Internal**: None (foundation feature)
