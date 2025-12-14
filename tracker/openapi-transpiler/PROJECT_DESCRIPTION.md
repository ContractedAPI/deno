# ContractedAPI IDL Transpiler

## Overview

Build a transpiler system for **ContractedAPI**, a contract-based Interface Definition Language (IDL) that is derived from OpenAPI but is its own distinct specification. ContractedAPI borrows structural concepts from OpenAPI (paths, components, $ref) but has its own semantics and is NOT compatible with OpenAPI tooling directly.

Key features:
- Contracts defined inline under `paths.{path}.{method}` with named keys (colon:case recommended)
- ContractCards (external files with default path/method) loaded via glob patterns
- $ref component resolution
- Transpilation to TypeScript (path-reflective namespaces) and can generate OpenAPI 3 output for tooling compatibility

## Key Differences from Original Orchestrator

| Aspect | Original Orchestrator | New Transpiler |
|--------|----------------------|----------------|
| Contract structure | `name`, `path`, `method`, `module`, `request`, `response` required | Minimal: just `request?`, `response?`, `ws?` |
| Routing | Defined per contract | Via `paths` object or ContractCard |
| Namespacing | From `name` (e.g., `target:control` → `Target`) | From URL path (e.g., `/api/users` → `Api.Users`) |
| Imports | `$include` for arrays | `#./glob/pattern/*.yaml` for ContractCards |
| Components | None | OpenAPI-style `$ref` with `components` object |
| Webhooks/Callbacks | Not supported | Supported (optional, fire-and-maybe-forget) |
| WebSocket flag | `websocket: true` | `ws: true` (simplified) |

## Reference Project

**Source**: `C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator`

Key files to reference:
- `transpile.ts` - TypeScript generation patterns (~550 lines)
- `loader.ts` - Format detection, $include processing (~406 lines)
- `contract.ts` - Original contract type definitions
- `server/builder.ts` - Route building from contracts (~319 lines)

## Phase Roadmap

| Phase | Focus | Scope |
|-------|-------|-------|
| 1 (Current) | Core Transpiler | Types, loader, glob support, $ref resolution, TypeScript/OpenAPI output |
| 2 | REST Server Generation | Hono router builder, validation, WebSocket support |
| 3 | CLI Generation | Command structure from paths, argument parsing |
| 4 | MCP Tool Generation | Tool schema generation, MCP server integration |
