# Feature: route-builder - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicServer.FeatureRouteBuilder`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-server/feature-route-builder/feature`

## Context

You are implementing the RouteBuilder pattern for organizing HTTP routes hierarchically. The RouteBuilder extends Map to create a tree structure matching URL paths.

## Key Implementation

```typescript
export class RouteBuilder extends Map<string, RouteBuilder> {
  #handlers = new Map<string, RouteHandler>();

  add(method: string, handler: RouteHandler): this {
    this.#handlers.set(method.toUpperCase(), handler);
    return this;
  }

  route(segment: string): RouteBuilder {
    if (!this.has(segment)) {
      this.set(segment, new RouteBuilder());
    }
    return this.get(segment)!;
  }
}
```

## Commit Guidelines

- Conventional commit style, micro-commits (~20 lines)

## Important Reminders

1. Stay in your worktree
2. Check the checklist in FEATURE_CHECKLIST.md
