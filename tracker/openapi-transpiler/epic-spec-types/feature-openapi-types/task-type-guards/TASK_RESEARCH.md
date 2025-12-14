# Task: type-guards - Research

## Reference

See [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for context.

## Type Guard Pattern

Type guards are runtime checks that narrow TypeScript types:

```typescript
function isReferenceObject(value: unknown): value is ReferenceObject {
  return typeof value === "object" && value !== null && "$ref" in value;
}
```

The `value is ReferenceObject` return type tells TypeScript this function is a type guard.

## Why Type Guards?

OpenAPI schemas can be either inline or references:
```typescript
schema?: JSONSchema | ReferenceObject;
```

Type guards let you handle each case:
```typescript
if (isReferenceObject(schema)) {
  // Resolve the reference
} else {
  // Use the inline schema
}
```
