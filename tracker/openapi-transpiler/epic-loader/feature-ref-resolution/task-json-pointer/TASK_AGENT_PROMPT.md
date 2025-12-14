# Task: json-pointer - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-ref-resolution/task-json-pointer/task`

## Implementation

```typescript
// src/loader/refs.ts

export function isLocalRef(ref: string): boolean {
  return ref.startsWith("#/");
}

export function parseJsonPointer(ref: string): string[] {
  if (!ref.startsWith("#/")) {
    throw new Error(`Invalid local ref: ${ref}`);
  }
  return ref
    .slice(2)
    .split("/")
    .map(segment =>
      segment.replace(/~1/g, "/").replace(/~0/g, "~")
    );
}
```

## Commit

`feat: add JSON pointer parsing`
