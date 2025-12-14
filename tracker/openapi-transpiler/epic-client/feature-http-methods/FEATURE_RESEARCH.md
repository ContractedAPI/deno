# Feature: http-methods - Research

## Simple vs Complex Methods

### Simple Methods (No Body)

```typescript
async simple(method: Method, path?: string, specificCode?: number): Promise<unknown> {
  const response = await fetch(this.#full(path), { method });
  const ok = response.ok && (specificCode ? response.status === specificCode : true);
  if (!ok) {
    throw new ResponseError(response.statusText, response.status);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}
```

### Complex Methods (With Body)

```typescript
async complex(method: Method, pathOrBody?: string | unknown, maybeBody?: unknown): Promise<unknown> {
  const path = typeof pathOrBody === "string" ? pathOrBody : undefined;
  const body = typeof pathOrBody === "string" ? maybeBody : pathOrBody;
  const response = await fetch(this.#full(path), {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new ResponseError(response.statusText, response.status);
  }
  return response.json();
}
```

## Method Overloads

```typescript
put(body?: unknown): Promise<unknown>;
put(path?: string, body?: unknown): Promise<unknown>;
put(pathOrBody?: string | unknown, maybeBody?: unknown): Promise<unknown> {
  return this.complex("PUT", pathOrBody, maybeBody);
}
```
