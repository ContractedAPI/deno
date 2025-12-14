# Project: openapi-transpiler - Research

## Architecture Overview

The reference project demonstrates a complete pipeline from contract definition to runtime:

```
┌─────────────────────────────────────────────────────────────┐
│           CONTRACT DEFINITION LAYER                         │
│  (root.yaml, endpoint.yaml, context.yaml, etc.)            │
└────────────────────────┬────────────────────────────────────┘
                         │
                    loader.ts
                    (Parse & $include)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           NORMALIZED CONTRACTS                              │
│  (EndpointContract[])                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
    transpile.ts                    builder.ts
    (Generate TS/JSON)              (Build routes)
         │                               │
         ▼                               ▼
    ┌─────────────┐              ┌─────────────┐
    │  api.ts     │              │  Hono App   │
    │(with types) │              │  (routes)   │
    └─────────────┘              └─────────────┘
         │                               │
         │                          serve.ts
         │                       (HTTP Server)
         │                               │
         └───────────┬───────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    client.ts              utility.ts
    (HTTP Client)      (Contract-based)
        │                         │
        └───────────┬─────────────┘
                    │
              Client Code
```

### Data Flow Phases

| Phase | Component | Input | Output |
|-------|-----------|-------|--------|
| **Definition** | YAML/TOML/JSON files | Human-authored specs | Contract definitions |
| **Loading** | `loader.ts` | Contract files | `EndpointContract[]` (normalized) |
| **Build (Types)** | `transpile.ts` | Normalized contracts | `api.ts` with TypeScript types |
| **Build (Routes)** | `builder.ts` | Normalized contracts | Hono router tree |
| **Runtime** | `serve.ts` + `client.ts` | Hono app / API types | HTTP server / typed client |

---

## ContractedAPI IDL Design

**ContractedAPI** is its own Interface Definition Language, derived from but NOT compatible with OpenAPI. Key semantic differences from OpenAPI:
- **Webhooks/Callbacks are optional**: Fire-and-maybe-forget semantics for two-way eventing
- **Multiple contracts per method**: Same `path.method` can have multiple named contracts, routed by request schema
- **Glob imports**: `#./glob/pattern` syntax for modular ContractCards
- **Simplified flags**: `ws: true` instead of verbose WebSocket definitions

ContractedAPI can *generate* OpenAPI 3 output for tooling compatibility, but this is a one-way conversion. ContractedAPI specs cannot be used directly with OpenAPI tooling.

### Root Document Structure

```typescript
type APISpec = {
  openapi?: string;
  info?: OpenAPIInfo;
  servers?: OpenAPIServer[];
  paths?: Record<string, PathItem | string>;  // string = glob pattern (#./...)
  components?: OpenAPIComponents;
  webhooks?: Record<string, WebhookDef>;      // optional, fire-and-maybe-forget
  callbacks?: Record<string, CallbackDef>;    // optional, fire-and-maybe-forget
}
```


### Contract Type

Contracts are defined inline under `path.method` with named keys (colon:case recommended, not required):

```typescript
type Contract = {
  request?: RequestBody | JSONSchema;  // no request = request body not permitted
  response?: ResponseBody | JSONSchema;
  ws?: boolean;
  error?: JSONSchema;
  description?: string;
  tags?: string[];
  deprecated?: boolean;
}

// Under a path method:
type MethodContracts = Record<string, Contract>;  // keys are contract names (colon:case recommended)
```

### ContractCard Type (External Import)

ContractCards are **external files** imported via glob patterns. They define default path and method:

```typescript
type ContractCard = Contract & {
  path: string;           // default path
  method: HttpMethod;     // default method
  name: string;           // colon:case contract name
  components?: OpenAPIComponents;  // local components, merged during load
}
```

### ContractCard Import Resolution

ContractCards are imported via `#glob/pattern` syntax. Resolution rules:

| Import Location | Path Used | Method Used |
|-----------------|-----------|-------------|
| Root `paths` key (`#./cards/*.yaml`) | Card's default path | Card's default method |
| Under a path (`/users/{id}: #./card.yaml`) | The path it's under | Card's default method |
| Under a method (`get: #./card.yaml`) | The path it's under | The method it's under |

**Merging**: If multiple ContractCards resolve to the same `path.method`, they are merged in document order.

### Request Schema Routing

When multiple contracts exist under the same `path.method`, the **request schema shape** determines which contract handles a request:

1. Contracts are evaluated in document order
2. First contract with a schema matching the incoming request is executed
3. No `request` schema = request body not permitted for that contract

**Best Practice** (recommendation, not enforced): Define stricter schemas before permissive ones.

## Example: Inline Contracts

```yaml
paths:
  /users/{id}:
    get:
      user:get:
        response:
          type: object
          properties:
            id: { type: string }
            name: { type: string }

    # Multiple contracts under same path.method - routed by request schema
    post:
      # Stricter schema first (has required 'role' field)
      user:create:admin:
        request:
          type: object
          required: [name, role]
          properties:
            name: { type: string }
            role: { type: string, enum: [admin, moderator] }
        response:
          type: object
          properties:
            id: { type: string }
            role: { type: string }

      # More permissive schema second (only requires 'name')
      user:create:
        request:
          type: object
          required: [name]
          properties:
            name: { type: string }
        response:
          type: object
          properties:
            id: { type: string }
```

## Example: ContractCard Imports

```yaml
paths:
  # Import at root - uses card's default path and method
  "#./cards/health-card.yaml": {}

  # Import under path - uses /users/{id}, card's default method
  /users/{id}:
    "#./cards/user-get-card.yaml": {}

    # Import under method - uses /users/{id} and POST
    post:
      "#./cards/user-create-card.yaml": {}

  # Glob import - multiple cards, merged by path.method in order found
  "#./cards/**/*-card.yaml": {}
```

## File Structure

```
<project-root>/
├── src/
│   ├── spec/                      # Type definitions
│   │   ├── mod.ts
│   │   ├── types.ts               # APISpec, Contract, ContractCard, etc.
│   │   └── openapi.ts             # OpenAPI-compatible types
│   │
│   ├── loader/                    # Loading and resolution
│   │   ├── mod.ts
│   │   ├── loader.ts              # Main loader (format detection, parsing)
│   │   ├── glob.ts                # Glob pattern resolution (#./path/*.yaml)
│   │   ├── refs.ts                # $ref resolution
│   │   └── components.ts          # Component merging
│   │
│   ├── transpiler/                # Transpilation engines
│   │   ├── mod.ts
│   │   ├── transpiler.ts          # Main orchestrator
│   │   ├── namespace.ts           # Path → namespace conversion
│   │   ├── typescript.ts          # TypeScript output
│   │   └── openapi.ts             # OpenAPI 3 YAML/JSON output
│   │
│   ├── schema/                    # JSON Schema utilities
│   │   ├── mod.ts
│   │   └── types.ts               # FromSchema, JSONSchema types
│   │
│   └── cli.ts                     # CLI entry point
│
├── deno.json
└── examples/
    ├── api.yaml                   # Example spec
    └── cards/                     # Example ContractCards
```

## Critical Files by Priority

| Priority | File | Purpose |
|----------|------|---------|
| 1 | `src/spec/types.ts` | Foundation types (APISpec, Contract, ContractCard) |
| 2 | `src/spec/openapi.ts` | OpenAPI-compatible type definitions |
| 3 | `src/loader/loader.ts` | Main loader orchestrating parsing/resolution |
| 4 | `src/loader/glob.ts` | Glob pattern expansion for ContractCard imports |
| 5 | `src/loader/refs.ts` | $ref resolution |
| 6 | `src/loader/components.ts` | Component merging strategy |
| 7 | `src/transpiler/namespace.ts` | Path-to-namespace conversion |
| 8 | `src/transpiler/typescript.ts` | TypeScript generation |
| 9 | `src/transpiler/openapi.ts` | OpenAPI 3 output generation |
| 10 | `src/cli.ts` | CLI entry point |
