# Feature: http-methods - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicClient.FeatureHttpMethods`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-client/feature-http-methods/feature`

## Context

Implement HTTP method helpers using the simple/complex pattern from the reference implementation.

## Key Implementation

```typescript
async simple(method: Method, path?: string, specificCode?: number): Promise<unknown> {
  const response = await fetch(this.#full(path), { method });
  const ok = response.ok && (specificCode ? response.status === specificCode : true);
  if (!ok) throw new ResponseError(response.statusText, response.status);
  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}

async complex(method: Method, pathOrBody?: string | unknown, maybeBody?: unknown): Promise<unknown> {
  const path = typeof pathOrBody === "string" ? pathOrBody : undefined;
  const body = typeof pathOrBody === "string" ? maybeBody : pathOrBody;
  const response = await fetch(this.#full(path), {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new ResponseError(response.statusText, response.status);
  return response.json();
}
```

## Commit Guidelines

- Conventional commit style, micro-commits (~20 lines)
