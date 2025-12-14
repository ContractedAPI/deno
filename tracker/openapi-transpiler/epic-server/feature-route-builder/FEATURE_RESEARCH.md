# Feature: route-builder - Research

## Reference Implementation

From epic-server EPIC_RESEARCH.md, the RouteBuilder pattern:

```typescript
export class RouteBuilder extends Map<string, RouteBuilder> {
  #handlers = new Map<string, Handler<unknown, unknown>>();

  add(method: string, handler: Handler<unknown, unknown>): this {
    this.#handlers.set(method.toUpperCase(), handler);
    return this;
  }

  get handlers(): Map<string, Handler<unknown, unknown>> {
    return this.#handlers;
  }

  route(segment: string): RouteBuilder {
    if (!this.has(segment)) {
      this.set(segment, new RouteBuilder());
    }
    return this.get(segment)!;
  }
}
```

## Path Matching

### Static Segments

```typescript
// /users/posts -> route("users").route("posts")
```

### Dynamic Segments

```typescript
// /users/{id} -> route("users").route(":id")
// Match any value, extract as parameter
```

## Testing Strategy

- Static route matching
- Dynamic route matching
- Parameter extraction
- Method-based dispatch
- 404 handling
