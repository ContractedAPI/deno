# Feature: base-client - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicClient.FeatureBaseClient`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-client/feature-base-client/feature`

## Context

Implement the base Client class with hierarchical URL composition from the reference implementation.

## Key Implementation

```typescript
export interface HasUrl {
  url: string;
  path?: string;
}

export class Client implements HasUrl {
  #url?: string;
  #parent?: HasUrl;
  #path?: string;

  constructor(url: string | HasUrl, path?: string) {
    if (typeof url === "string") {
      this.#url = url;
    } else {
      this.#parent = url;
      this.#path = path ?? "";
    }
  }

  get url(): string {
    if (this.#url) return this.#url;
    const parentUrl = this.#parent!.url;
    const base = parentUrl.endsWith("/") ? parentUrl : parentUrl + "/";
    return this.#path ? new URL(this.#path, base).href : parentUrl;
  }
}
```

## Commit Guidelines

- Conventional commit style, micro-commits (~20 lines)
