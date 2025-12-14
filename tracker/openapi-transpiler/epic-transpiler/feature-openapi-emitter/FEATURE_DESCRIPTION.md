# Feature: openapi-emitter

## Overview

Implement OpenAPI 3.x output generation from ContractedAPI specifications. This feature generates OpenAPI-format output for compatibility with existing tooling. Note: This is a one-way conversion - ContractedAPI is its own IDL and cannot be used directly with OpenAPI tooling.

## Key Deliverables

- OpenAPI 3.x document generation
- Path consolidation (multiple contracts per path)
- Operation object generation
- Component extraction and formatting
- YAML and JSON output options

## File Structure

```
src/transpiler/
├── emit/
│   ├── openapi.ts      # Main OpenAPI emitter
│   ├── paths.ts        # Paths object generation
│   ├── operations.ts   # Operation object generation
│   └── components.ts   # Components extraction
└── types.ts            # OpenAPIEmitterOptions
```

## Dependencies

### External
- `@std/yaml` - YAML serialization

### Internal
- feature-namespace-builder (namespace for tags)
- epic-loader (contract data)

## Dependents

- feature-output-formats (uses emitter output)

## Key Patterns

### OpenAPI Document Structure

```yaml
openapi: "3.0.3"
info:
  title: "ContractedAPI"
  version: "1.0.0"
paths:
  /users:
    get:
      operationId: users:list
      responses:
        "200":
          content:
            application/json:
              schema: { ... }
    post:
      operationId: users:create
      requestBody:
        content:
          application/json:
            schema: { ... }
      responses:
        "200":
          content:
            application/json:
              schema: { ... }
components:
  schemas:
    User: { ... }
```

## Acceptance Criteria

- [ ] Generates valid OpenAPI 3.x document
- [ ] Consolidates contracts by path
- [ ] Correctly maps methods to operations
- [ ] Extracts shared components
- [ ] Supports YAML and JSON output
- [ ] Validates against OpenAPI spec
