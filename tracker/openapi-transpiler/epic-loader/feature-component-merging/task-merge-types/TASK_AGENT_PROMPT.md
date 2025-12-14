# Task: merge-types - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-component-merging/task-merge-types/task`

## Implementation

```typescript
// src/loader/merge.ts

export type MergeStrategy = "error" | "namespace" | "first-wins" | "last-wins";

export type MergeOptions = {
  strategy: MergeStrategy;
  namespaceSeparator?: string;
};

export type Conflict = {
  type: string;  // "schemas", "responses", etc.
  name: string;
  cardName: string;
  reason: string;
};

export const DEFAULT_MERGE_OPTIONS: MergeOptions = {
  strategy: "error",
  namespaceSeparator: "_",
};
```

## Commit

`feat: add merge type definitions`
