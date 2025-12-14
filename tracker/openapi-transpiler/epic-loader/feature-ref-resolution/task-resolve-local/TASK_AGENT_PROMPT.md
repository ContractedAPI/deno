# Task: resolve-local - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-ref-resolution/task-resolve-local/task`

## Implementation

```typescript
export type RefContext = {
  visited: Set<string>;
  chain: string[];
};

export function createRefContext(): RefContext {
  return { visited: new Set(), chain: [] };
}

export function resolvePointer(pointer: string[], document: unknown): unknown {
  let current = document;
  for (const segment of pointer) {
    if (current === null || typeof current !== "object") {
      throw new Error(`Cannot resolve pointer: ${pointer.join("/")}`);
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

export function resolveRef(
  ref: string,
  document: unknown,
  ctx: RefContext
): unknown {
  if (ctx.visited.has(ref)) {
    throw new Error(`Circular reference: ${ctx.chain.join(" -> ")} -> ${ref}`);
  }
  ctx.visited.add(ref);
  ctx.chain.push(ref);

  const pointer = parseJsonPointer(ref);
  return resolvePointer(pointer, document);
}
```

## Commit

`feat: add local ref resolution`
