# Task: from-schema - Research

## Reference

See [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for the reference implementation pattern.

## Why the JSONObject Intersection?

From the reference project (`schema.ts`):

```typescript
export type FromSchema<SCHEMA extends JSONSchema, OPTIONS extends FromSchemaOptions = FromSchemaDefaultOptions> =
  CoreFromSchema<SCHEMA, OPTIONS> extends { [x: string]: unknown; }
    ? CoreFromSchema<SCHEMA, OPTIONS> & JSONObject
    : CoreFromSchema<SCHEMA, OPTIONS>;
```

### Purpose

1. **JSON Serialization Safety**: Ensures inferred types are JSON-serializable
2. **Index Signature**: `JSONObject` provides `{ [key: string]: JSONValue }`
3. **Runtime Compatibility**: Aligns compile-time types with runtime JSON behavior

### Conditional Type Pattern

The pattern `extends { [x: string]: unknown }` detects if the inferred type is object-like:
- If yes: intersect with `JSONObject`
- If no: return unchanged (primitives, arrays, unions)

## json-schema-to-ts Limitations

Known limitations that this wrapper addresses:
- `$ref` resolution requires explicit `references` array
- Object types may not have index signatures by default
- The `as const` assertion is required for literal inference
