# Task: import-context - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-glob-resolution/task-import-context/task`

## Implementation

```typescript
export type ImportContext = {
  pathOverride?: string;
  methodOverride?: string;
  visited: Set<string>;
  baseDir: string;
};

export function createContext(baseDir: string): ImportContext {
  return { visited: new Set(), baseDir };
}

export function withOverrides(
  ctx: ImportContext,
  path?: string,
  method?: string
): ImportContext {
  return {
    ...ctx,
    pathOverride: path ?? ctx.pathOverride,
    methodOverride: method ?? ctx.methodOverride,
  };
}
```

## Commit

`feat: add import context for glob resolution`
