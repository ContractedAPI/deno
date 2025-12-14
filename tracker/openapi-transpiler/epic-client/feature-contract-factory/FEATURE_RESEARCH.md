# Feature: contract-factory - Research

## Factory Pattern

From epic-client EPIC_RESEARCH.md:

```typescript
export function create<TReq, TRes>(
  contract: EndpointContract<TReq, TRes>,
  client: Client
): (request?: TReq) => Promise<TRes> {
  const method = contract.method.toUpperCase();
  const path = contract.path;

  if (["GET", "HEAD", "DELETE"].includes(method)) {
    return async (request?: TReq) => {
      const url = request ? `${path}?${encodeParams(request)}` : path;
      return client.simple(method, url) as Promise<TRes>;
    };
  } else {
    return async (request?: TReq) => {
      return client.complex(method, path, request) as Promise<TRes>;
    };
  }
}
```

## Query Parameter Encoding

```typescript
function encodeParams(obj: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      params.set(key, typeof value === "object"
        ? JSON.stringify(value)
        : String(value));
    }
  }
  return params.toString();
}
```

## Type Flow

```
Contract<TReq, TRes>
    |
    v
create(contract, client)
    |
    v
(request?: TReq) => Promise<TRes>
```
