# Feature: typescript-emitter

## Overview

Implement TypeScript code generation for ContractedAPI specifications. This feature generates the typed contracts array, namespace declarations, type exports, binding types, and client factories.

## Key Deliverables

- Contracts array generation with `as const`
- Namespace declaration generation
- Type exports (Contract, Response, Request types)
- Binding type generation
- Miniclient factory generation
- Import statement generation

## File Structure

```
src/transpiler/
├── emit/
│   ├── typescript.ts   # Main TypeScript emitter
│   ├── contracts.ts    # Contracts array generation
│   ├── namespace.ts    # Namespace block generation
│   ├── types.ts        # Type generation utilities
│   └── imports.ts      # Import statement generation
└── types.ts            # EmitterOptions
```

## Dependencies

### External
- None (generates string output)

### Internal
- feature-namespace-builder (namespace structure)
- epic-loader (contract data)

## Dependents

- feature-output-formats (uses emitter output)

## Key Patterns

### Generated Output Structure

```typescript
// 1. Imports
import { FromSchema, ContractByName } from "@contracted/types";
import { create } from "@contracted/client";

// 2. Contracts array
export const contracts = [
  { name: "root:list", path: "/", method: "GET", ... } as const,
  // ...
] as const;

// 3. Base types
export type Contracts = typeof contracts;
export type Contract = Contracts[number];

// 4. Namespace declarations
export namespace Users {
  export type ListContract = ContractByName<Contracts, "users:list">;
  export type ListResponse = FromSchema<ListContract["response"]>;
  export const list = contracts.find(c => c.name === "users:list")!;
  export const miniclient = () => ({ list: create(list) });
}

// 5. Combined types
export type IContractCLI<T> = Users.Binding<T> & Posts.Binding<T>;
```

## Acceptance Criteria

- [ ] Generates valid TypeScript code
- [ ] Includes all contracts in array
- [ ] Generates correct namespace structure
- [ ] Type exports work with FromSchema
- [ ] Binding types are correctly typed
- [ ] Output compiles without errors
