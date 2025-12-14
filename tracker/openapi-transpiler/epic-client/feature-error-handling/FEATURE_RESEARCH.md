# Feature: error-handling (client) - Research

## ResponseError Class

```typescript
export class ResponseError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ResponseError";
  }
}
```

## Alive Pattern

Health check that returns boolean:

```typescript
async alive(path?: string, specificCode?: number): Promise<boolean> {
  try {
    await this.head(path, specificCode);
    return true;
  } catch (error) {
    if (error instanceof ResponseError)
      return false;
    else
      throw error;
  }
}
```

Returns `false` for HTTP errors, rethrows network errors.
