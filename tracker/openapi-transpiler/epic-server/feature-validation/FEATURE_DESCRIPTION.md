# Feature: validation

## Overview

Implement request/response validation using JSON Schema and AJV. This feature validates incoming requests against contract schemas and ensures responses conform to expected formats.

## Key Deliverables

- AJV validator integration
- Request body validation
- Response validation (optional)
- Schema-based contract dispatch
- Validation error formatting

## File Structure

```
src/server/
├── validation.ts       # Validation logic
├── ajv.ts              # AJV configuration
├── dispatch.ts         # Schema-based dispatch
└── types.ts            # ValidationResult types
```

## Dependencies

### External
- `ajv` - JSON Schema validator

### Internal
- epic-spec-types (contract schemas)
- feature-route-builder (matched routes)

## Dependents

- feature-error-handling (validation errors)

## Acceptance Criteria

- [ ] Validates request bodies against schema
- [ ] Schema dispatch selects correct contract
- [ ] Validation errors include path/message
- [ ] Optional response validation
- [ ] Performance acceptable for high throughput
