# Epic: transpiler

## Overview

Implement the transpilation engines that convert loaded ContractedAPI specifications into:
1. **TypeScript code** - Typed contracts array, namespace exports, binding types, client factories
2. **OpenAPI 3 output** - Generate OpenAPI 3.1 YAML/JSON for tooling compatibility (one-way conversion)

The transpiler is the bridge between the ContractedAPI IDL format and usable code/specs. It takes normalized contracts from the loader and produces output files that downstream epics and external tools can consume.

## Key Deliverables

### feature-namespace-derivation
- Convert URL paths to TypeScript namespaces
- Handle path parameters (`{id}` → `Id` or flatten)
- Group contracts by namespace prefix
- Generate namespace hierarchy

### feature-contract-codegen
- Generate `contracts` array with `as const` assertions
- Generate base types: `Contracts`, `Contract`, `ContractName`
- Inline JSON schemas in generated code
- Preserve schema structure for `FromSchema` inference

### feature-namespace-codegen
- Generate per-namespace exports:
  - Contract types (`UserContract = ContractByName<...>`)
  - Response types (`UserResponse = FromSchema<...>`)
  - Request types (when applicable)
  - Contract instances (`const user = contracts.find(...)`)
  - Client factories (`miniclient()`)
  - Binding types (`Binding<T>`, `MiniBinding<T>`)

### feature-combined-types
- Generate combined binding types (`IContractCLI<T>`, `IContractMCP<T>`)
- Generate assertion types for compile-time validation
- Generate helper utilities (prefix mapping, etc.)

### feature-openapi-output
- Convert ContractedAPI spec to OpenAPI 3.1 format
- Map multiple contracts per path.method to OpenAPI operations
- Preserve components and schemas
- Output as YAML or JSON

## File Structure

```
src/transpiler/
├── mod.ts              # Public exports
├── transpiler.ts       # Main orchestrator
├── namespace.ts        # Path → namespace conversion
├── contracts.ts        # Contract array generation
├── namespaces.ts       # Namespace type generation
├── combined.ts         # Combined types generation
├── openapi.ts          # OpenAPI 3 output
└── format.ts           # Code formatting utilities
```

## Dependencies

### External
- None required (pure TypeScript generation)
- Optional: Prettier for code formatting

### Internal
- **epic-spec-types** (must be complete)
  - Type definitions for contracts
  - `FromSchema`, `ContractByName` utilities
- **epic-loader** (must be complete)
  - Loaded and resolved specifications
  - Normalized contract arrays

## Dependents

- **epic-server** - Uses generated types for handler bindings
- **epic-client** - Uses generated client factories
- **epic-cli** - Uses generated contracts for command structure
- **epic-mcp** - Uses generated contracts for tool schemas

## Output Example

The transpiler generates files like `contracts/api.ts` (~1990 lines in reference):

```typescript
// Contracts array with full schemas
export const contracts = [
  { name: "user:list", path: "/users", method: "GET", ... },
  // ... all contracts
] as const;

// Base types
export type Contracts = typeof contracts;
export type Contract = Contracts[number];

// Per-namespace exports
export namespace Users {
  export type ListContract = ContractByName<Contracts, "user:list">;
  export type ListResponse = FromSchema<ListContract["response"]>;
  export const list = contracts.find(c => c.name === "user:list")!;
  export const miniclient = () => ({ list: create(list), ... });
  export type Binding<T> = { "user:list": T; ... };
}

// Combined types
export type IContractCLI<T> = Users.Binding<T> & ...;
```
