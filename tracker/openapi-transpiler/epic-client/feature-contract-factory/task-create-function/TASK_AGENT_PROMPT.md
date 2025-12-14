# Task: create-function - Agent Prompt

> **Branch**: `openapi-transpiler/epic-client/feature-contract-factory/task-create-function/task`

## Implementation
```typescript
const SIMPLE_METHODS = ['GET', 'HEAD', 'DELETE'];

function interpolatePath(path: string, params: Record<string, unknown>): string {
  return path.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ''));
}

function toQueryString(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (!entries.length) return '';
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

export function create<T extends Contract>(
  contract: T,
  client: Client
): (request?: InferRequest<T>) => Promise<InferResponse<T>> {
  return async (request) => {
    const path = interpolatePath(contract.path, request ?? {});

    if (SIMPLE_METHODS.includes(contract.method)) {
      const query = request ? toQueryString(request) : '';
      return client.get(path + query);
    }

    return client.complex(contract.method, path, request);
  };
}
```

## Commit
`feat: add contract factory function`
