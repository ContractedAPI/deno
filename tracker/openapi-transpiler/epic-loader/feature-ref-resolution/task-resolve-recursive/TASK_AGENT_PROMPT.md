# Task: resolve-recursive - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-ref-resolution/task-resolve-recursive/task`

## Implementation

```typescript
export function resolveRefs(
  data: unknown,
  document: unknown,
  ctx: RefContext = createRefContext()
): unknown {
  if (data === null || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => resolveRefs(item, document, ctx));
  }

  const obj = data as Record<string, unknown>;

  if ("$ref" in obj && typeof obj.$ref === "string") {
    if (isLocalRef(obj.$ref)) {
      const resolved = resolveRef(obj.$ref, document, ctx);
      return resolveRefs(resolved, document, ctx);
    }
    return obj; // Preserve external refs
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = resolveRefs(value, document, ctx);
  }
  return result;
}
```

## Commit

`feat: add recursive ref resolution`
