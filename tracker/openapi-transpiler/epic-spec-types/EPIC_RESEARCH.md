# Epic: spec-types - Research

> This document contains initial prework and research for the spec-types epic.

## OpenAPI 3.1 as Inspiration (NOT Compatibility)

ContractedAPI is derived from OpenAPI 3.1, borrowing structural concepts. However, ContractedAPI is NOT compatible with OpenAPI - it is its own distinct IDL. The following OpenAPI constructs influenced ContractedAPI's design:

### Concepts Borrowed from OpenAPI 3.1

| OpenAPI Construct | ContractedAPI Usage |
|-------------------|---------------------|
| `openapi` version field | Optional (aliased as `contractedapi`) |
| `info` object | Optional metadata |
| `servers` array | Optional server definitions |
| `paths` object | Core routing structure |
| `components` object | Schema/response/parameter reuse |
| `$ref` pointers | Component references |
| JSON Schema (Draft 2020-12) | Request/response schemas |

### OpenAPI 3.1 Document Structure (Reference)

```typescript
type OpenAPIDocument = {
  openapi: string;                    // Required in OpenAPI, optional in ContractedAPI
  info: InfoObject;                   // Required in OpenAPI, optional in ContractedAPI
  servers?: ServerObject[];
  paths?: PathsObject;
  webhooks?: Record<string, PathItemObject | ReferenceObject>;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
}
```

---

## ContractedAPI: IDL-like Contract Specification

ContractedAPI is its own IDL, derived from but NOT compatible with OpenAPI. It functions as an Interface Definition Language and is a **contract specification** that:

1. **Describes contracts, not just endpoints** - Multiple named contracts can exist under a single `path.method`
2. **Supports schema-based routing** - Request schema shape determines which contract handles a request
3. **Enables modular composition** - ContractCards and glob imports for scalable specs
4. **Generates typed function signatures** - For CLI objects, MCP tools, REST clients, REST servers, etc.

> **Clarification**: Unlike full IDLs (Protocol Buffers, Thrift) that define complete service/RPC semantics, ContractedAPI generates **method signatures on target objects** - e.g., methods on a CLI class, tools on an MCP server, endpoints on a REST router.

### Contract vs Operation

In OpenAPI, each path+method has exactly one "operation." In ContractedAPI, each path+method can have **multiple named contracts**:

```yaml
# OpenAPI: one operation
/users:
  post:
    operationId: createUser
    requestBody: ...
    responses: ...

# ContractedAPI: multiple contracts under same path.method
/users:
  post:
    user:create:          # Contract 1: standard user
      request: { ... }
      response: { ... }
    user:create:admin:    # Contract 2: admin user (stricter schema)
      request: { ... }
      response: { ... }
```

---

## Schema Library: json-schema-to-ts

### Standard Approach

The [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) library is the standard for inferring TypeScript types from JSON Schema in the OpenAPI ecosystem. This is documented by Ajv and Fastify.

### Reference Project Implementation

From `Claude-Browser-Control-Deno/src/orchestrator/schema.ts`:

```typescript
import type { JSONSchema, FromSchema as CoreFromSchema } from "json-schema-to-ts";

export type FromSchema<SCHEMA extends JSONSchema, OPTIONS extends FromSchemaOptions = FromSchemaDefaultOptions> =
  CoreFromSchema<SCHEMA, OPTIONS> extends { [x: string]: unknown; }
    ? CoreFromSchema<SCHEMA, OPTIONS> & JSONObject
    : CoreFromSchema<SCHEMA, OPTIONS>;
```

### Usage Pattern

```typescript
import { FromSchema } from 'json-schema-to-ts';

export const UserSchema = {
  type: 'object',
  required: ['id', 'name'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
} as const;  // <-- MUST be const for type inference

export type User = FromSchema<typeof UserSchema>;
// Inferred: { id: string; name: string }
```

### Known Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| `$ref` resolution | Must pass explicit `references` array | Pre-resolve refs during load |
| `not` keyword | Requires opt-in; can result in `any` | Avoid or use `parseNotKeyword` |
| `if/then/else` | Requires opt-in; performance issues | Avoid or use `parseIfThenElseKeywords` |
| TypeScript config | Requires `strict: true` | Configure tsconfig |
| `as const` requirement | Schema loses type hints during authoring | Accept tradeoff |

### Runtime Validation

`json-schema-to-ts` is **compile-time only**. For runtime validation, use **Ajv**:

```typescript
import Ajv from "ajv";
const ajv = new Ajv();
const validate = ajv.compile(UserSchema);
if (validate(data)) {
  // data is typed as User
}
```

---

## Field Aliases

The `Specification` type provides alias fields for OpenAPI 3.1 compatibility:

| ContractedAPI Field | OpenAPI Alias | Purpose |
|---------------------|---------------|---------|
| `contractedapi` | `openapi` | Version string |
| `spec` | `paths` | Route/contract definitions |
| `events` | `webhooks` | Fire-and-maybe-forget events |

Both field names are valid; the loader normalizes to the ContractedAPI names internally.

```yaml
# Using ContractedAPI field names (preferred)
contractedapi: "1.0.0"
spec:
  /users:
    get:
      user:list: { ... }
events:
  onUserCreated: { ... }

# Using OpenAPI aliases (for familiarity)
openapi: "3.1.0"
paths:
  /users:
    get:
      user:list: { ... }
webhooks:
  onUserCreated: { ... }
```

---

## Type Definitions Research

### Core Types

#### `Specification` (Root Document)

```typescript
export type Specification = {
  contractedapi?: string;     // ContractedAPI version (preferred)
  openapi?: string;           // OpenAPI alias
  info?: InfoObject;
  servers?: ServerObject[];
  spec?: SpecObject;          // ContractedAPI field name (preferred)
  paths?: SpecObject;         // OpenAPI alias
  events?: EventsObject;      // ContractedAPI field name (preferred)
  webhooks?: EventsObject;    // OpenAPI alias
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
};
```

#### `Contract` (Minimal Contract Definition)

```typescript
export type Contract = {
  request?: RequestBodyObject | JSONSchema;
  response?: ResponseObject | JSONSchema;
  ws?: boolean;
  error?: JSONSchema;
  description?: string;
  tags?: string[];
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
  parameters?: ParameterObject[];
};
```

#### `ContractCard` (External Contract File)

```typescript
export type ContractCard = Contract & {
  path: string;
  method: HttpMethod;
  name: string;
  components?: ComponentsObject;
};
```

#### `ContractCardPath` (Glob Import Pattern)

```typescript
export type ContractCardPath = `#${string}`;

export function isContractCardPath(value: string): value is ContractCardPath {
  return value.startsWith('#');
}
```

---

## Contract Lookup Types Research

From `Claude-Browser-Control-Deno/src/orchestrator/client/utility.ts`:

```typescript
export type ContractByName<
  Contracts extends readonly EndpointContract[],
  Name extends Contracts[number]["name"]
> = Extract<Contracts[number], { name: Name }>;
```

**Key capabilities needed:**
- **Contract lookup by name** - Find a specific contract using string literal type
- **Name extraction** - Get union of all contract names from a collection
- **Binding generation** - Create mapped types requiring all contracts to be implemented
- **Namespace grouping** - Filter/group contracts by prefix or pattern

---

## Reference Project Contract Hierarchy

The reference project has 30 contracts organized into 5 namespaces. This demonstrates the expected scale and organization:

| Namespace | Count | Contracts |
|-----------|-------|-----------|
| **Root** | 3 | `health` (HEAD /), `list` (GET /), `killAll` (DELETE /) |
| **Endpoint** | 4 | `exists`, `info`, `launch`, `killAll` |
| **Context** | 4 | `exists`, `info`, `create`, `close` |
| **Target** | 11 | `cdp`, `exists`, `info`, `control`, `create`, `content`, `emulate`, `throttle`, `intercept`, `label`, `close` |
| **Node** | 6 | `exists`, `info`, `create`, `replace`, `interact`, `remove` |

### Namespace Derivation Pattern (Reference)

The reference project derives namespaces from **contract names**:

```
Contract name: "root:health"    → Namespace: Root,     Action: health
Contract name: "target:control" → Namespace: Target,   Action: control
Contract name: "node:create"    → Namespace: Node,     Action: create
```

**Rule**: Split on first colon (`:`), PascalCase the prefix.

### Namespace Derivation Pattern (New IDL)

The new ContractedAPI system derives namespaces from **URL paths** instead:

```
Path: /api/users      → Namespace: Api.Users
Path: /api/users/{id} → Namespace: Api.Users (or Api.Users.Id)
Path: /auth/login     → Namespace: Auth
Path: /               → Namespace: Root
```

**Conversion rules:**
1. Split path on `/`
2. Filter empty segments
3. PascalCase each segment
4. Handle path parameters: `{id}` → `Id` or flatten to parent
5. Join with `.` for nested namespaces

### Implications for Type Design

The type system must support:
1. **Grouping contracts by namespace prefix** - Filter contracts by path prefix
2. **Generating per-namespace exports** - Contract types, response types, bindings
3. **Nested namespace support** - `/api/users` vs `/api/posts` share `Api` parent
4. **Path parameter handling** - Decide if `{id}` creates sub-namespace or not

---

## File Structure

```
src/
├── spec/
│   ├── mod.ts                 # Public exports
│   ├── types.ts               # Core ContractedAPI types
│   ├── openapi.ts             # OpenAPI 3.1 compatibility types
│   └── helpers.ts             # Type guards and utilities
│
└── schema/
    ├── mod.ts                 # Public exports
    ├── types.ts               # JSON serializable types, FromSchema
    ├── inference.ts           # ContractRequest, ContractResponse helpers
    └── lookup.ts              # ContractByName, ContractBinding helpers
```

---

## Open Questions (Resolved)

1. **$ref strategy**: Preserve during type definitions, resolve in loader epic
2. **FromSchema corrections**: The `& JSONObject` intersection for object types
3. **Ajv integration**: Optional peer dependency, required only for loader/server
4. **Strictness**: Default options, document opt-in features
5. **Branded types**: Nice-to-have, not required for MVP

---

## References

- [OpenAPI 3.1.1 Specification](https://spec.openapis.org/oas/v3.1.1.html)
- [json-schema-to-ts GitHub](https://github.com/ThomasAribart/json-schema-to-ts)
- [openapi-ts-json-schema](https://github.com/toomuchdesign/openapi-ts-json-schema)
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core.html)
