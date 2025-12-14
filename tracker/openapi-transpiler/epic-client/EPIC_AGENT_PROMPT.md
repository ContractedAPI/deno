# Epic: client - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicClient`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-client/epic`

## Context

You are working on the common HTTP client foundation that will be shared by both the CLI and MCP integrations. This epic provides the runtime layer that connects generated TypeScript code to actual HTTP requests.

The client epic is **reusable infrastructure** - both epic-cli and epic-mcp depend on it.

## Your Role at Epic Level

At the epic level, your responsibilities are:
1. Implement the base Client class with URL composition
2. Set up HTTP method helpers (simple/complex pattern)
3. Create the contract-to-client factory integration
4. Establish error handling patterns

**Individual features are implemented by dedicated feature-level agents.**

## Prerequisites

This epic depends on:
- **epic-spec-types** (must be complete) - Contract type definitions
- **epic-loader** (must be complete) - Loaded contracts for factory
- **epic-transpiler** (must be complete) - Generated `miniclient()` pattern to integrate with

## Reference Project

The reference implementation is at:
`C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator\client\`

Key files:
- `client.ts` (~137 lines) - Client class with URL composition and HTTP methods

**Remember**: After viewing reference files, return to your worktree.

## File Structure Target

```
src/client/
├── mod.ts              # Public exports
├── client.ts           # Base Client class
├── methods.ts          # HTTP method helpers (or inline in client.ts)
├── factory.ts          # Contract-based factory (create function)
├── errors.ts           # ResponseError class
└── types.ts            # HasUrl, ClientConfig types
```

## Key Patterns

### Client Class with URL Composition

The Client class supports hierarchical URL building:

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

  get path(): string {
    if (this.#parent?.path)
      return [this.#parent.path, this.#path].filter(Boolean).join("/");
    return this.#path ?? "";
  }
}
```

Usage:
```typescript
const root = new Client("http://localhost:3000");
const users = new Client(root, "users");  // http://localhost:3000/users
const user = new Client(users, "123");    // http://localhost:3000/users/123
```

### Simple vs Complex Methods

The client distinguishes between bodyless and body-carrying HTTP methods:

```typescript
// Simple: GET, HEAD, DELETE (no request body)
async simple(method: Method, path?: string, specificCode?: number): Promise<unknown> {
  const response = await fetch(this.#full(path), { method });
  // ... error handling, JSON parsing
}

// Complex: POST, PUT, PATCH (with request body)
async complex(method: Method, path?: string, body?: unknown, specificCode?: number): Promise<unknown> {
  const response = await fetch(this.#full(path), {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  // ... error handling, JSON parsing
}
```

### Method Overloads

Convenience methods support flexible call signatures:

```typescript
// Path-only variant
await client.get("/users");

// Body-only variant (uses current URL)
await client.post({ name: "Alice" });

// Path + body variant
await client.post("/users", { name: "Alice" });
```

Implement with TypeScript overloads:
```typescript
put(body?: unknown): Promise<unknown>;
put(path?: string, body?: unknown): Promise<unknown>;
put(pathOrBody?: string | unknown, maybeBody?: unknown): Promise<unknown> {
  return this.complex("PUT", pathOrBody, maybeBody);
}
```

### Contract Factory Integration

The `create()` factory maps contracts to typed HTTP calls:

```typescript
// In generated miniclient.ts
export const miniclient = (client: Client) => ({
  list: create(listContract, client),   // GET /users
  create: create(createContract, client), // POST /users
});

// Usage
const api = miniclient(new Client("http://localhost:3000"));
const users = await api.list();
const newUser = await api.create({ name: "Alice" });
```

### Error Handling

```typescript
export class ResponseError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ResponseError";
  }
}

// Thrown on non-OK responses
if (!response.ok) {
  throw new ResponseError(response.statusText, response.status);
}
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines
- Format: `type: description` (feat, fix, docs, refactor, chore)

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Don't implement features** - Focus on epic-level coordination
4. **Check the checklist** - Refer to [EPIC_CHECKLIST.md](./EPIC_CHECKLIST.md)
5. **Study reference client** - The URL composition pattern is key
6. **Consider type safety** - Generated types must flow through to runtime
