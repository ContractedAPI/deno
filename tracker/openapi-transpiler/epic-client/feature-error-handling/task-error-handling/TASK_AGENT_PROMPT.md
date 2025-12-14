# Task: error-handling - Agent Prompt

> **Branch**: `openapi-transpiler/epic-client/feature-error-handling/task-error-handling/task`

## Implementation
```typescript
// Add to Client class
async alive(path = ''): Promise<boolean> {
  try {
    await this.head(path);
    return true;
  } catch {
    return false;
  }
}

// Update error handling in simple/complex methods
private async handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text().catch(() => null);
    throw new ResponseError(
      response.statusText || `HTTP ${response.status}`,
      response.status,
      body ? JSON.parse(body) : undefined
    );
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
```

## Commit
`feat: add error handling and alive pattern`
