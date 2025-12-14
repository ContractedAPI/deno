# Feature: openapi-types - Research

## OpenAPI 3.1 Type Reference

See [EPIC_RESEARCH.md](../EPIC_RESEARCH.md) for comprehensive type definitions.

## Key Types Summary

### Info and Server
- `InfoObject` - API metadata
- `ServerObject` - Server URL and variables
- `TagObject` - Grouping tags

### Components
- `ComponentsObject` - Reusable component container
- `ReferenceObject` - `$ref` pointer wrapper

### Request/Response
- `ParameterObject` - Path, query, header, cookie parameters
- `RequestBodyObject` - Request body with content types
- `ResponseObject` - Response with headers and content
- `MediaTypeObject` - Media type with schema

### Security
- `SecuritySchemeObject` - Auth scheme definitions
- `SecurityRequirementObject` - Security requirements

### Utility
- `HttpMethod` - HTTP method union type
- `isReferenceObject()` - Type guard for $ref objects
