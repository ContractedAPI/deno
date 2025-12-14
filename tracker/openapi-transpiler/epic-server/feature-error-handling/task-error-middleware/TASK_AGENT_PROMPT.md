# Task: error-middleware - Agent Prompt

> **Branch**: `openapi-transpiler/epic-server/feature-error-handling/task-error-middleware/task`

## Implementation
```typescript
export interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
  stack?: string;
}

export function formatError(error: unknown, includeStack = false): ErrorResponse {
  if (error instanceof CodedError) {
    return {
      error: error.message,
      code: error.code,
      details: error.details,
      ...(includeStack && { stack: error.stack }),
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      ...(includeStack && { stack: error.stack }),
    };
  }

  return { error: String(error) };
}

export function errorMiddleware(ctx: Context, err: Error) {
  const isDev = Deno.env.get('DENO_ENV') !== 'production';
  const response = formatError(err, isDev);
  const status = err instanceof CodedError ? err.status : 500;
  return ctx.json(response, status);
}
```

## Commit
`feat: add error handling middleware`
