# Feature: contract-factory - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicClient.FeatureContractFactory`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-client/feature-contract-factory/feature`

## Context

Implement the contract-to-client factory that creates typed HTTP call functions.

## Key Implementation

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

## Commit Guidelines

- Conventional commit style, micro-commits (~20 lines)
