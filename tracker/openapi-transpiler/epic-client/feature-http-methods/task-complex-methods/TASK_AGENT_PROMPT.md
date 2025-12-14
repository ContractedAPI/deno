# Task: complex-methods - Agent Prompt

> **Branch**: `openapi-transpiler/epic-client/feature-http-methods/task-complex-methods/task`

## Implementation
```typescript
// Add to Client class
async complex<T>(method: string, pathOrBody?: string | unknown, body?: unknown): Promise<T> {
  let url = this.url;
  let payload = body;

  if (typeof pathOrBody === 'string') {
    url = normalizeUrl(this.url, pathOrBody);
  } else if (pathOrBody !== undefined) {
    payload = pathOrBody;
  }

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!response.ok) {
    throw new ResponseError(response.statusText, response.status);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

post<T>(body: unknown): Promise<T>;
post<T>(path: string, body: unknown): Promise<T>;
post<T>(pathOrBody: string | unknown, body?: unknown): Promise<T> {
  return this.complex<T>('POST', pathOrBody, body);
}

put<T>(body: unknown): Promise<T>;
put<T>(path: string, body: unknown): Promise<T>;
put<T>(pathOrBody: string | unknown, body?: unknown): Promise<T> {
  return this.complex<T>('PUT', pathOrBody, body);
}

patch<T>(body: unknown): Promise<T>;
patch<T>(path: string, body: unknown): Promise<T>;
patch<T>(pathOrBody: string | unknown, body?: unknown): Promise<T> {
  return this.complex<T>('PATCH', pathOrBody, body);
}
```

## Commit
`feat: add complex HTTP methods`
