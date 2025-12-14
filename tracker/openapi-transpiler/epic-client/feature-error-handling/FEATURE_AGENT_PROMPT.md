# Feature: error-handling (client) - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicClient.FeatureErrorHandling`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-client/feature-error-handling/feature`

## Context

Implement client-side error handling with ResponseError for HTTP errors.

## Key Implementation

```typescript
export class ResponseError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ResponseError";
  }
}

async alive(path?: string): Promise<boolean> {
  try {
    await this.head(path);
    return true;
  } catch (error) {
    if (error instanceof ResponseError) return false;
    throw error;
  }
}
```

## Commit Guidelines

- Conventional commit style, micro-commits (~20 lines)
