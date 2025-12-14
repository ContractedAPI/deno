# Task: route-builder - Agent Prompt

> **Branch**: `openapi-transpiler/epic-server/feature-route-builder/task-route-builder/task`

## Implementation
```typescript
export class RouteBuilder {
  private root: RouteNode = { handlers: new Map(), children: new Map() };

  add(method: string, path: string, handler: RouteHandler): void {
    const segments = path.split('/').filter(Boolean);
    let node = this.root;

    for (const segment of segments) {
      if (segment.startsWith('{') && segment.endsWith('}')) {
        const name = segment.slice(1, -1);
        if (!node.paramChild) {
          node.paramChild = { name, node: { handlers: new Map(), children: new Map() } };
        }
        node = node.paramChild.node;
      } else {
        if (!node.children.has(segment)) {
          node.children.set(segment, { handlers: new Map(), children: new Map() });
        }
        node = node.children.get(segment)!;
      }
    }
    node.handlers.set(method.toUpperCase(), handler);
  }

  match(method: string, path: string): MatchResult | null {
    const segments = path.split('/').filter(Boolean);
    const params: Record<string, string> = {};
    let node = this.root;

    for (const segment of segments) {
      if (node.children.has(segment)) {
        node = node.children.get(segment)!;
      } else if (node.paramChild) {
        params[node.paramChild.name] = segment;
        node = node.paramChild.node;
      } else {
        return null;
      }
    }

    const handler = node.handlers.get(method.toUpperCase());
    return handler ? { handler, params } : null;
  }
}
```

## Commit
`feat: add RouteBuilder class`
