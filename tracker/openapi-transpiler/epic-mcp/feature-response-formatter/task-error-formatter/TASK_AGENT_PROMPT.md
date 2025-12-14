# Task: error-formatter - Agent Prompt

> **Branch**: `openapi-transpiler/epic-mcp/feature-response-formatter/task-error-formatter/task`

## Implementation
```typescript
export interface FormattedError {
  isError: true;
  message: string;
  status?: number;
  details?: string;
}

export function formatError(error: unknown): FormattedError {
  if (error instanceof ResponseError) {
    return {
      isError: true,
      message: error.message,
      status: error.status,
      details: error.body ? formatResponse(error.body) : undefined,
    };
  }

  if (error instanceof Error) {
    return {
      isError: true,
      message: error.message,
    };
  }

  return {
    isError: true,
    message: String(error),
  };
}

export function errorToText(error: FormattedError): string {
  const lines = [`Error: ${error.message}`];
  if (error.status) {
    lines.push(`Status: ${error.status}`);
  }
  if (error.details) {
    lines.push(`Details:\n${error.details}`);
  }
  return lines.join('\n');
}
```

## Commit
`feat: add MCP error formatter`
