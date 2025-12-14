# Task: simple-methods - Agent Prompt

> **Branch**: `openapi-transpiler/epic-client/feature-http-methods/task-simple-methods/task`

## Implementation
```typescript
// Add to Client class
async simple<T>(method: string, path = '', specificCode?: number): Promise<T> {
  const url = normalizeUrl(this.url, path);
  const response = await fetch(url, { method });

  if (!response.ok) {
    throw new ResponseError(response.statusText, response.status);
  }

  if (specificCode && response.status !== specificCode) {
    throw new ResponseError(`Expected ${specificCode}, got ${response.status}`, response.status);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

get<T>(path?: string, specificCode?: number): Promise<T> {
  return this.simple<T>('GET', path, specificCode);
}

head(path?: string, specificCode?: number): Promise<null> {
  return this.simple<null>('HEAD', path, specificCode);
}

delete<T>(path?: string, specificCode?: number): Promise<T> {
  return this.simple<T>('DELETE', path, specificCode);
}
```

## Commit
`feat: add simple HTTP methods`
