# Epic: server

## Overview

Implement REST server generation from ContractedAPI specifications. The server epic provides:
1. **RouteBuilder** - Hierarchical route tree construction using the BuildPhase pattern
2. **Schema-based dispatch** - Route multiple contracts per path.method based on request shape
3. **Request/response validation** - AJV-based validation middleware
4. **WebSocket support** - Automatic upgrade handling for `ws: true` contracts
5. **Type-safe handlers** - Strongly typed handler bindings from generated types

This epic uses the **BuildPhase pattern** (documented in research) which enables parallel construction of independent route segments.

## Key Deliverables

### feature-build-phase
- Implement `BuildPhase<T>` class with dependency tracking
- Promise-like interface for async/await usage
- Lazy execution with `run()` trigger
- Improvements: error propagation, cancellation, progress tracking

### feature-route-builder
- Implement `RouteBuilder` extending `Map<string, RouteBuilder>`
- Tree construction from contract paths
- Integration with BuildPhase for parallel builds
- Memoized phase creation (init, handlers, setup, children)

### feature-schema-dispatch
- AJV schema compilation per contract
- Request schema matching for multi-contract dispatch
- Document-order evaluation of contracts
- `SubrouteNotFoundError` when no schema matches (422)

### feature-validation
- Request validation middleware
- Optional response validation
- Error schema validation
- Configurable validation options

### feature-websocket
- Detect `ws: true` contracts
- `upgradeWebSocket` middleware integration
- Dynamic module loading for WebSocket handlers
- Hono WebSocket adapter

### feature-error-handling
- Error response formatting
- `InvalidResponseError`, `SubrouteNotFoundError`, `CodedError`
- Consistent error JSON structure
- Status code mapping

## File Structure

```
src/server/
├── mod.ts              # Public exports: serve, build
├── builder.ts          # RouteBuilder class
├── phase.ts            # BuildPhase class
├── dispatch.ts         # Schema-based dispatch logic
├── validation.ts       # AJV validation middleware
├── websocket.ts        # WebSocket upgrade handling
├── errors.ts           # Error classes
├── registry.ts         # Instance tracking (optional)
├── types.ts            # ServerConfig, Instance types
└── serve.ts            # HTTP server lifecycle
```

## Dependencies

### External
- **Hono** - Web framework
- **Ajv** - JSON Schema validation
- **@hono/node-ws** or Deno WebSocket - WebSocket support

### Internal
- **epic-spec-types** (must be complete)
  - Contract, Specification types
  - JSON Schema types
- **epic-loader** (must be complete)
  - Loaded contracts with resolved schemas
- **epic-transpiler** (must be complete)
  - Generated types for handler bindings

## Dependents

- None (end-user facing component)

## Key Patterns

### BuildPhase Pattern
```typescript
const build = new BuildPhase<Hono>((phase) => {
  // ... build logic
  phase.complete(app);
}).depends(init, handlers);

await build.run();
```

### RouteBuilder Tree
```typescript
const root = new RouteBuilder("");
for (const contract of contracts) {
  root.ensure(contract.path).contracts.push(contract);
}
const app = await root.build().run();
```

### Schema Dispatch
```typescript
// Multiple contracts on same path.method
// First matching schema wins
for (const contract of contracts) {
  if (!contract.request || validate(input, contract.request)) {
    return contract.handler(input);
  }
}
throw new SubrouteNotFoundError();
```
