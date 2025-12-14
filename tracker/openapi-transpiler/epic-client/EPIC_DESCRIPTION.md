# Epic: client

## Overview

Implement the common HTTP client foundation that will be shared by both the CLI and MCP integrations. This provides:
1. **Base Client class** - URL composition with hierarchical parent support
2. **HTTP method helpers** - `simple()` for GET/HEAD/DELETE, `complex()` for POST/PUT/PATCH
3. **Contract-based factory** - `create(contract)` generates typed method wrappers
4. **Error handling** - `ResponseError` with status codes

The client epic produces reusable components that epic-cli and epic-mcp build upon for their specific interfaces.

## Key Deliverables

### feature-base-client
- `Client` class with URL composition
- Parent-child URL hierarchy support
- Path joining utilities
- `HasUrl` interface for composition

### feature-http-methods
- `simple()` method for GET, HEAD, DELETE (no body)
- `complex()` method for POST, PUT, PATCH (with body)
- Method overloads for path vs body arguments
- JSON serialization/deserialization

### feature-contract-factory
- `create(contract)` factory function
- Maps contract to typed HTTP call
- Handles method routing (GET vs POST, etc.)
- Integrates with generated `miniclient()` pattern

### feature-error-handling
- `ResponseError` class with status code
- HTTP error detection and wrapping
- Specific status code validation
- `alive()` helper for health checks

## File Structure

```
src/client/
├── mod.ts              # Public exports
├── client.ts           # Base Client class
├── methods.ts          # HTTP method helpers
├── factory.ts          # Contract-based factory
├── errors.ts           # ResponseError class
└── types.ts            # HasUrl, ClientConfig types
```

## Dependencies

### External
- **Fetch API** - Built-in (Deno/Node/Browser)
- No external HTTP client library required

### Internal
- **epic-spec-types** (must be complete)
  - Contract type definitions
  - HTTP method types
- **epic-loader** (must be complete)
  - Loaded contracts for factory
- **epic-transpiler** (must be complete)
  - Generated `miniclient()` pattern to integrate with

## Dependents

- **epic-cli** - Uses Client for command execution
- **epic-mcp** - Uses Client for tool execution

## Key Patterns

### Client URL Composition
```typescript
const root = new Client("http://localhost:3000");
const users = new Client(root, "users");  // http://localhost:3000/users
const user = new Client(users, "123");    // http://localhost:3000/users/123
```

### Method Helpers
```typescript
// Simple methods (no body)
await client.get("/path");
await client.head("/path");
await client.delete("/path");

// Complex methods (with body)
await client.post("/path", { data: "value" });
await client.put({ data: "value" });  // Path optional
```

### Contract Factory
```typescript
// Generated miniclient uses create()
export const miniclient = () => ({
  list: create(listContract),   // GET /users
  create: create(createContract), // POST /users
});

// Usage
const client = miniclient();
const users = await client.list();
const newUser = await client.create({ name: "Alice" });
```
