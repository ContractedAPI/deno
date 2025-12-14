# Epic: spec-types

## Overview

Define the foundation types for ContractedAPI, an IDL that is derived from OpenAPI but is its own distinct specification (NOT compatible with OpenAPI tooling directly).

## Key Deliverables

- Core ContractedAPI types (Specification, Contract, ContractCard)
- OpenAPI 3.1 type definitions (for generating OpenAPI output)
- JSON Schema utilities and FromSchema wrapper
- Type inference helpers for extracting request/response types

## Semantic Differences from OpenAPI

| Aspect | OpenAPI 3.1 | ContractedAPI |
|--------|-------------|---------------|
| **Operations** | One operation per path+method | Multiple named contracts per path+method |
| **Routing** | Path + method only | Path + method + request schema shape |
| **Imports** | `$ref` to components | `$ref` + glob patterns (`#./cards/*.yaml`) |
| **Webhooks** | Strict callback semantics | Fire-and-maybe-forget (optional response) |
| **Purpose** | API documentation | Typed signature generation |

## Dependencies

- **External**: `json-schema-to-ts` (^3.0.0), `ajv` (^8.0.0, optional)
- **Internal**: None (foundation epic)

## Dependents

All other epics depend on this one:
- epic-loader, epic-transpiler, epic-server, epic-client, epic-cli, epic-mcp
