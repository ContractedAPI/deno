# Epic: server - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicServer`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-server/epic`

## Context

You are working on REST server generation from ContractedAPI specifications. The server epic builds Hono-based HTTP servers with:
- Parallel route construction via BuildPhase pattern
- Schema-based dispatch for multiple contracts per path.method
- AJV validation middleware
- WebSocket upgrade support

This is a **critical** epic with the most complex pattern: **BuildPhase**. Study the research document thoroughly.

## Your Role at Epic Level

At the epic level, your responsibilities are:
1. Implement the BuildPhase class (foundation for everything)
2. Set up the server module structure
3. Coordinate validation and dispatch patterns
4. Handle integration between RouteBuilder and Hono

**Individual features are implemented by dedicated feature-level agents.**

## Prerequisites

This epic depends on:
- **epic-spec-types** (must be complete) - Type definitions
- **epic-loader** (must be complete) - Loaded contracts
- **epic-transpiler** (must be complete) - Generated handler types

## Reference Project

The reference implementation is at:
`C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator\server\`

Key files:
- `builder.ts` (~319 lines) - RouteBuilder and BuildPhase
- `serve.ts` (~50 lines) - Server lifecycle
- `errors.ts` (~26 lines) - Error classes
- `registry.ts` (~44 lines) - Instance tracking
- `types.ts` (~44 lines) - Config types

**CRITICAL**: The `BuildPhase` pattern in `builder.ts` is essential. See [EPIC_RESEARCH.md](./EPIC_RESEARCH.md) for full documentation.

**Remember**: After viewing reference files, return to your worktree.

## File Structure Target

```
src/server/
├── mod.ts              # Public exports: serve, build
├── builder.ts          # RouteBuilder class
├── phase.ts            # BuildPhase class (CRITICAL)
├── dispatch.ts         # Schema-based dispatch logic
├── validation.ts       # AJV validation middleware
├── websocket.ts        # WebSocket upgrade handling
├── errors.ts           # Error classes
├── registry.ts         # Instance tracking (optional)
├── types.ts            # ServerConfig, Instance types
└── serve.ts            # HTTP server lifecycle
```

## BuildPhase Pattern (CRITICAL)

This is the most important pattern in this epic. Study it carefully:

```typescript
class BuildPhase<T> implements PromiseLike<T> {
  #dependencies: BuildPhase<any>[] = [];
  #promise: Promise<T>;
  complete!: (value: T) => void;
  fail!: (reason?: unknown) => void;

  constructor(job: (phase: BuildPhase<T>) => Promise<void> | void) { ... }

  depends(...phases: BuildPhase<any>[]): this { ... }

  run(): this {
    // Only runs once (idempotent)
    // Waits for all dependencies first
    // Then executes the job
  }

  then(...) { return this.#promise.then(...); }
}
```

See [EPIC_RESEARCH.md](./EPIC_RESEARCH.md) for:
- Full implementation
- Usage in RouteBuilder
- Potential improvements (error propagation, cancellation, progress)

## RouteBuilder Pattern

```typescript
class RouteBuilder extends Map<string, RouteBuilder> {
  contracts: EndpointContract[] = [];

  ensure(path: string): RouteBuilder { ... }

  build(): BuildPhase<this> {
    return this.#phase((phase) => {
      // Build Hono app
      phase.complete(this);
    }).depends(this.#setup(), this.#children(), this.#init());
  }
}
```

## Schema Dispatch Pattern

When multiple contracts exist on the same path.method:

1. Compile each contract's request schema with AJV
2. For incoming request, try schemas in document order
3. First match → execute that contract's handler
4. No match → `SubrouteNotFoundError` (422)

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines
- Format: `type: description` (feat, fix, docs, refactor, chore)

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Don't implement features** - Focus on epic-level coordination
4. **Check the checklist** - Refer to [EPIC_CHECKLIST.md](./EPIC_CHECKLIST.md)
5. **Study BuildPhase first** - It's the foundation for RouteBuilder
