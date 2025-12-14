# Task: glob-detection - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-glob-resolution/task-glob-detection/task`

## Implementation

```typescript
// src/loader/glob.ts

export type GlobMatch = {
  pattern: string;
  files: string[];
};

export function isGlobPattern(key: string): boolean {
  return key.startsWith("#");
}
```

## Commit

`feat: add glob pattern detection`
