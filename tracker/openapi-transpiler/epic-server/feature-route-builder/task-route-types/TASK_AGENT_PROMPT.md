# Task: route-types - Agent Prompt

> **Branch**: `openapi-transpiler/epic-server/feature-route-builder/task-route-types/task`

## Implementation
```typescript
export type RouteHandler = (ctx: Context) => Response | Promise<Response>;

export interface RouteNode {
  handlers: Map<string, RouteHandler>; // method -> handler
  children: Map<string, RouteNode>;
  paramChild?: { name: string; node: RouteNode };
}

export interface MatchResult {
  handler: RouteHandler;
  params: Record<string, string>;
}
```

## Commit
`feat: add route builder types`
