# Task: namespace-types - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-namespace-builder/task-namespace-types/task`

## Implementation
```typescript
export type NamespaceNode = {
  name: string;
  children: Map<string, NamespaceNode>;
  contracts: Contract[];
};

export type NamespaceTree = {
  root: Map<string, NamespaceNode>;
};
```

## Commit
`feat: add namespace tree types`
