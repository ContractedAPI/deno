# Epic: transpiler - Research

## Reference Files

| File | ~Lines | Purpose |
|------|--------|---------|
| `transpile.ts` | 550 | TypeScript generation patterns |
| `contracts/api.ts` | 1990 | **GENERATED** - Shows expected output format |

---

## Generated Output Structure (contracts/api.ts)

The reference project's generated `contracts/api.ts` (1990 lines) demonstrates the exact output format the transpiler should produce. Understanding this structure is critical.

### File Structure Breakdown

```
contracts/api.ts (1990 lines)
├── Lines 1-15: Imports and type imports
├── Lines 16-1593: contracts array (all 30 contracts with schemas)
├── Lines 1595-1651: Base type exports
└── Lines 1653-1989: Namespaced types and utilities
```

### 1. Contracts Array (lines 16-1593)

All contracts defined as a single `as const` array for type inference:

```typescript
export const contracts = [
  {
    name: "root:health",
    path: "/",
    method: "HEAD",
    module: "./root/health.ts",
    request: { /* JSON Schema */ } as const,
    response: { /* JSON Schema */ } as const,
  },
  // ... 29 more contracts
] as const;
```

**Key patterns:**
- Uses `as const` assertions throughout for literal type inference
- Each contract has: `name`, `path`, `method`, `module`, `request?`, `response`, `error?`
- Schemas are inline JSON Schema objects

### 2. Base Type Exports (lines 1595-1651)

```typescript
export type Contracts = typeof contracts;
export type Contract = Contracts[number];
export type ContractName = Contract["name"];
```

### 3. Namespaced Types (lines 1653-1989)

For each namespace (Root, Endpoint, Context, Target, Node), the following pattern is generated:

```typescript
export namespace Root {
  // === Contract Types (using ContractByName) ===
  export type HealthContract = ContractByName<Contracts, "root:health">;
  export type ListContract = ContractByName<Contracts, "root:list">;
  export type KillAllContract = ContractByName<Contracts, "root:killAll">;

  // === Response Types (using FromSchema) ===
  export type HealthResponse = FromSchema<HealthContract["response"]>;
  export type ListResponse = FromSchema<ListContract["response"]>;
  export type KillAllResponse = FromSchema<KillAllContract["response"]>;

  // === Request Types (only if contract has request) ===
  // export type SomeRequest = FromSchema<SomeContract["request"]>;

  // === Contract Instances (runtime access) ===
  export const health = contracts.find(c => c.name === "root:health")!;
  export const list = contracts.find(c => c.name === "root:list")!;
  export const killAll = contracts.find(c => c.name === "root:killAll")!;

  // === Client Factory ===
  export const miniclient = () => ({
    health: create(health),
    list: create(list),
    killAll: create(killAll),
  });

  // === Binding Types (for type-safe dispatch) ===
  export type Binding<T> = {
    "root:health": T;
    "root:list": T;
    "root:killAll": T;
  };

  export type MiniBinding<T> = {
    health: T;
    list: T;
    killAll: T;
  };

  export type FullBinding<T> = {
    Root: MiniBinding<T>;
  };

  // === Assertion Types (compile-time validation) ===
  export type AssertBinding<T extends Binding<unknown>> = T;
  export type AssertMiniBinding<T extends MiniBinding<unknown>> = T;
  export type AssertFullBinding<T extends FullBinding<unknown>> = T;
}
```

### 4. Combined Types (lines 1953-1989)

Types that span all namespaces:

```typescript
// All bindings intersected - for CLI/MCP that must implement everything
export type IContractCLI<T> =
  Root.Binding<T> &
  Endpoint.Binding<T> &
  Context.Binding<T> &
  Target.Binding<T> &
  Node.Binding<T>;

export type IContractMCP<T> = IContractCLI<T>;

// Prefix helper for remapping keys
export type PrefixedMiniBinding<Prefix extends string, T> = {
  [K in keyof T as `${Prefix}_${string & K}`]: T[K];
};
```

---

## Namespace Derivation

### Reference Project Pattern (Contract Name Based)

The reference project derives namespaces from contract names:

```
Contract: "root:health"    → Namespace: Root,    Action: health
Contract: "target:control" → Namespace: Target,  Action: control
Contract: "node:create"    → Namespace: Node,    Action: create
```

**Rule**: Split on first colon, PascalCase the prefix.

### New IDL Pattern (URL Path Based)

The new system derives namespaces from URL paths instead:

```
Path: /api/users     → Namespace: Api.Users
Path: /api/users/{id} → Namespace: Api.Users.Id (or Api.Users)
Path: /auth/login    → Namespace: Auth
Path: /             → Namespace: Root
```

**Conversion rules:**
1. Split path on `/`
2. Filter empty segments
3. PascalCase each segment
4. Handle path parameters: `{id}` → `Id` or flatten to parent
5. Join with `.` for nested namespaces

---

## Code Generation Patterns

### Type Generation Order

1. **Imports**: Schema utilities, types
2. **Contracts Array**: All contracts as `const`
3. **Base Types**: Contracts, Contract, ContractName
4. **Per-Namespace**:
   - Contract types (using ContractByName)
   - Response types (using FromSchema)
   - Request types (if applicable)
   - Contract instances (runtime lookup)
   - Client factory (miniclient)
   - Binding types (full, mini, assertion)
5. **Combined Types**: IContractCLI, IContractMCP

### String Generation Helpers

From the reference, these patterns are used:

```typescript
// Contract type
`export type ${ActionPascal}Contract = ContractByName<Contracts, "${name}">;`

// Response type
`export type ${ActionPascal}Response = FromSchema<${ActionPascal}Contract["response"]>;`

// Request type (conditional)
if (contract.request) {
  `export type ${ActionPascal}Request = FromSchema<${ActionPascal}Contract["request"]>;`
}

// Instance
`export const ${actionCamel} = contracts.find(c => c.name === "${name}")!;`

// Binding entry
`"${name}": T;`

// MiniBinding entry
`${actionCamel}: T;`
```

---

## Research Topics

- [x] Generated output structure (documented above)
- [x] Namespace derivation patterns
- [ ] Path parameter handling in namespaces
- [ ] Code formatting options (prettier integration?)
- [ ] Import/export organization
- [ ] OpenAPI 3 YAML/JSON output format
- [ ] Handling contracts without request schemas
- [ ] Error type generation
