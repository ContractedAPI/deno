# Feature: core-types

## Overview

Implement ContractedAPI-specific types including the Specification root type, Contract, ContractCard, and related structures. ContractedAPI is its own IDL derived from but NOT compatible with OpenAPI.

## Key Deliverables

- `Specification` type with field aliases (contractedapi/openapi, spec/paths, events/webhooks)
- `Contract` type (minimal contract definition)
- `ContractCard` type (external contract file)
- `ContractCardPath` type and type guard
- `SpecObject`, `PathItemObject`, `ContractCollection` types
- `EventsObject` and `EventDefinition` types

## Files

- `src/spec/types.ts` - ContractedAPI-specific types
- `src/spec/mod.ts` - Public exports

## Dependencies

- **External**: None
- **Internal**:
  - feature-schema-types (JSONSchema type)
  - feature-openapi-types (OpenAPI compatibility types)
