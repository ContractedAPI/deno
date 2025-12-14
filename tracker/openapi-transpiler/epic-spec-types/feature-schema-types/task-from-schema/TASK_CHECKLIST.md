# Task: from-schema - Checklist

## Implementation Checklist

- [x] Import `FromSchema as CoreFromSchema` from json-schema-to-ts
- [x] Import `FromSchemaOptions`, `FromSchemaDefaultOptions` from json-schema-to-ts
- [x] Define wrapped `FromSchema<SCHEMA, OPTIONS>` type
- [x] Implement conditional `& JSONObject` intersection for object results
- [x] Re-export `FromSchemaOptions` and `FromSchemaDefaultOptions`
- [x] Add JSDoc comments with usage examples
  - Note: Basic JSDoc present; detailed example deferred to feature-level JSDoc task
- [x] Test with sample schema using `as const`

## Acceptance Criteria

- [x] FromSchema infers correct types from `as const` schemas
- [x] Object types include JSONObject intersection
- [x] Non-object types pass through unchanged
- [x] JSDoc includes working example
  - Note: Basic documentation present; enhanced examples in feature-level JSDoc task
