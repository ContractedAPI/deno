# Task: client-types - Agent Prompt

> **Branch**: `openapi-transpiler/epic-client/feature-base-client/task-client-types/task`

## Implementation
```typescript
export interface HasUrl {
  get url(): string;
  get path(): string;
}

export interface ClientOptions {
  headers?: Record<string, string>;
  timeout?: number;
}
```

## Commit
`feat: add client base types`
