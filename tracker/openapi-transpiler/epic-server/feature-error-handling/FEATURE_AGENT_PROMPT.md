# Feature: error-handling - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicServer.FeatureErrorHandling`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-server/feature-error-handling/feature`

## Context

You are implementing structured error handling for ContractedAPI servers with typed error responses and consistent formatting.

## Key Implementation

```typescript
export class CodedError extends Error {
  constructor(
    message: string,
    public readonly code: number = 500
  ) {
    super(message);
    this.name = "CodedError";
  }
}

export function errorToResponse(error: unknown): Response {
  const body = formatError(error);
  const status = error instanceof CodedError ? error.code : 500;
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
```

## Commit Guidelines

- Conventional commit style, micro-commits (~20 lines)

## Important Reminders

1. Stay in your worktree
2. Check the checklist in FEATURE_CHECKLIST.md
