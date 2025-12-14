# Task: coded-error - Agent Prompt

> **Branch**: `openapi-transpiler/epic-server/feature-error-handling/task-coded-error/task`

## Implementation
```typescript
export const ErrorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  INTERNAL_ERROR: 500,
} as const;

export class CodedError extends Error {
  constructor(
    public readonly code: keyof typeof ErrorCodes,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'CodedError';
  }

  get status(): number {
    return ErrorCodes[this.code];
  }
}
```

## Commit
`feat: add CodedError class`
