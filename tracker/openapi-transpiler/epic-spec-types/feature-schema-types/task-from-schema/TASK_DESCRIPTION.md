# Task: from-schema

## Overview

Implement the `FromSchema` wrapper type that provides type inference from JSON Schema definitions with the `& JSONObject` correction for object types.

## Deliverables

- `FromSchema<T>` type wrapper with JSONObject intersection
- `FromSchemaOptions` type for configuration
- `FromSchemaDefaultOptions` type constant

## File Target

`src/schema/types.ts` (extend existing file)

## Estimated Scope

~15-25 lines of type definitions

## Key Behavior

The wrapper ensures that when `FromSchema` infers an object type, it is intersected with `JSONObject` to maintain JSON serialization guarantees.
