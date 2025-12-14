# Feature: error-handling - Research

## Reference Implementation

From epic-server EPIC_RESEARCH.md:

```typescript
export class CodedError extends Error {
  constructor(
    message: string,
    public readonly code: number = 500
  ) {
    super(message);
    this.name = "CodedError";
  }
}
```

## Error Response Format

```typescript
interface ErrorResponse {
  error: {
    message: string;
    code: number;
    details?: unknown;
  };
}
```

## Status Code Mapping

| Code | Meaning |
|------|---------|
| 400 | Bad Request (validation) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## Stack Trace Handling

```typescript
function formatError(error: unknown, isDev: boolean): ErrorResponse {
  const base = {
    message: error instanceof Error ? error.message : String(error),
    code: error instanceof CodedError ? error.code : 500,
  };

  if (isDev && error instanceof Error) {
    return { error: { ...base, stack: error.stack } };
  }

  return { error: base };
}
```

## Testing Strategy

- CodedError with various codes
- Unknown error handling
- Validation error details
- Stack trace visibility
