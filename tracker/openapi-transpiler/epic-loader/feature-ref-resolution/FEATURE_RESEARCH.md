# Feature: ref-resolution - Research

## JSON Pointer (RFC 6901)

### Syntax

```
#/path/to/value
```

- `#` - Document root marker
- `/` - Segment separator
- Each segment is a property name or array index

### Escape Sequences

Special characters must be escaped:
- `~` -> `~0`
- `/` -> `~1`

Example:
```
#/definitions/foo~1bar  -> definitions["foo/bar"]
#/definitions/foo~0bar  -> definitions["foo~bar"]
```

### Decoding Order

Decode `~1` before `~0`:
```typescript
segment.replace(/~1/g, "/").replace(/~0/g, "~")
```

## Reference Implementation

From epic-loader EPIC_RESEARCH.md:

```typescript
function resolveRef(ref: string, document: Specification): unknown {
  if (!ref.startsWith('#/')) {
    // External ref - preserve for downstream
    return { $ref: ref };
  }

  const pointer = ref.slice(2).split('/');
  let current: unknown = document;

  for (const segment of pointer) {
    if (typeof current !== 'object' || current === null) {
      throw new Error(`Cannot resolve ${ref}: path not found`);
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}
```

## Circular Reference Detection

### Algorithm

Track visited refs in a Set:

```typescript
function resolveRefs(
  data: unknown,
  document: Specification,
  visited: Set<string> = new Set()
): unknown {
  if (typeof data === 'object' && data !== null) {
    if ('$ref' in data) {
      const ref = (data as { $ref: string }).$ref;

      if (visited.has(ref)) {
        throw new Error(`Circular reference detected: ${ref}`);
      }

      visited.add(ref);
      const resolved = resolveRef(ref, document);
      return resolveRefs(resolved, document, visited);
    }

    // Recurse into object/array
  }
  return data;
}
```

### Error Messages

Good circular error:
```
Circular reference detected: #/components/schemas/User
Reference chain:
  #/components/schemas/User
  -> #/components/schemas/Person
  -> #/components/schemas/User (circular)
```

## Reference Types

### Local References

```yaml
$ref: "#/components/schemas/User"
```

Action: Resolve within current document.

### File References

```yaml
$ref: "./user.yaml#/User"
```

Action: Preserve for external loader (not this feature's scope).

### Remote References

```yaml
$ref: "https://example.com/schemas/user.json"
```

Action: Preserve (or optionally fetch - not in scope).

## Resolution Strategies

### Inline Resolution

Replace `$ref` with actual schema:

```typescript
// Before
{ $ref: "#/components/schemas/User" }

// After
{ type: "object", properties: { name: { type: "string" } } }
```

Pros: Simple, self-contained
Cons: Duplicates data, breaks for circular schemas

### Lazy Resolution

Keep refs, resolve on demand:

```typescript
class LazyRef {
  constructor(private ref: string, private document: unknown) {}

  resolve(): unknown {
    return resolvePointer(parseJsonPointer(this.ref), this.document);
  }
}
```

Pros: Handles circular, memory efficient
Cons: More complex to use

### Hybrid Resolution

Inline non-circular, mark circular:

```typescript
function resolveRefs(data, ctx) {
  if (isRef(data)) {
    if (ctx.inProgress.has(data.$ref)) {
      // Circular - keep as ref but mark
      return { $ref: data.$ref, $circular: true };
    }
    // Non-circular - inline
    return resolveRefs(resolvedValue, ctx);
  }
}
```

## Deep Traversal

Schema locations that may contain refs:

```typescript
const REF_LOCATIONS = [
  "properties.*",           // Object properties
  "items",                  // Array items
  "additionalProperties",   // Additional props
  "allOf.*",                // allOf schemas
  "oneOf.*",                // oneOf schemas
  "anyOf.*",                // anyOf schemas
  "not",                    // not schema
  "if", "then", "else",     // Conditional
];
```

## Edge Cases

### Empty Pointer

```yaml
$ref: "#/"
```

Points to document root. Usually not useful but valid.

### Array Index

```yaml
$ref: "#/items/0"
```

Points to first element of `items` array.

### Missing Target

```yaml
$ref: "#/components/schemas/NonExistent"
```

Should throw descriptive error:
```
Reference not found: #/components/schemas/NonExistent
Available schemas: User, Post, Comment
```

### Nested Refs

A resolved ref may itself contain refs:

```yaml
components:
  schemas:
    User:
      allOf:
        - $ref: "#/components/schemas/Person"
        - type: object
    Person:
      type: object
```

Must recursively resolve.

## Testing Strategy

Test cases:
1. Simple local ref
2. Nested property ref
3. Array index ref
4. Escaped characters in pointer
5. Direct circular ref
6. Indirect circular ref (A -> B -> A)
7. External refs preserved
8. Missing target error
9. Deeply nested refs
10. Ref inside ref (nested resolution)
