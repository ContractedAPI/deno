# Task: response-error - Agent Prompt

> **Branch**: `openapi-transpiler/epic-client/feature-error-handling/task-response-error/task`

## Implementation
```typescript
export class ResponseError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = 'ResponseError';
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}
```

## Commit
`feat: add ResponseError class`
