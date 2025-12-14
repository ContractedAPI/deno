# Task: component-types - Research

## Reference

See [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for OpenAPI details.

## Components Object

OpenAPI components provide reusable definitions:
- `schemas`: JSON Schema definitions
- `responses`: Response definitions
- `parameters`: Parameter definitions
- `examples`: Example values
- `requestBodies`: Request body definitions
- `headers`: Header definitions
- `securitySchemes`: Authentication schemes
- `links`: Link definitions
- `callbacks`: Callback definitions

## Reference Object

The `$ref` pointer follows JSON Pointer syntax:
- Local: `#/components/schemas/User`
- External: `./common.yaml#/components/schemas/User`
