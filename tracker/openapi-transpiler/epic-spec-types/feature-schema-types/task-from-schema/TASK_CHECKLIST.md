# Task: from-schema - Checklist

## Implementation Checklist

- [ ] Import `FromSchema as CoreFromSchema` from json-schema-to-ts
- [ ] Import `FromSchemaOptions`, `FromSchemaDefaultOptions` from json-schema-to-ts
- [ ] Define wrapped `FromSchema<SCHEMA, OPTIONS>` type
- [ ] Implement conditional `& JSONObject` intersection for object results
- [ ] Re-export `FromSchemaOptions` and `FromSchemaDefaultOptions`
- [ ] Add JSDoc comments with usage examples
- [ ] Test with sample schema using `as const`

## Acceptance Criteria

- [ ] FromSchema infers correct types from `as const` schemas
- [ ] Object types include JSONObject intersection
- [ ] Non-object types pass through unchanged
- [ ] JSDoc includes working example
