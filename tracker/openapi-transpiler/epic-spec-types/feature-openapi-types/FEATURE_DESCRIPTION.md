# Feature: openapi-types

## Overview

Implement OpenAPI 3.1 type definitions used when generating OpenAPI output from ContractedAPI specs. These types define the target format for OpenAPI generation, not the source ContractedAPI format.

## Key Deliverables

- All OpenAPI 3.1 core types (InfoObject, ServerObject, ComponentsObject, etc.)
- ReferenceObject type and type guard
- ParameterObject, RequestBodyObject, ResponseObject types
- Security scheme types
- HTTP method type

## Files

- `src/spec/openapi.ts` - OpenAPI compatibility types
- `src/spec/helpers.ts` - Type guards and utility functions

## Dependencies

- **External**: None
- **Internal**: feature-schema-types (JSONSchema type)
