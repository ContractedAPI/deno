# Feature: typescript-emitter - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicTranspiler.FeatureTypescriptEmitter`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-transpiler/feature-typescript-emitter/feature`

## Context

You are implementing TypeScript code generation for ContractedAPI specifications. The emitter produces a typed contracts file that includes the contracts array, namespace declarations, and type utilities.

## Your Role

Implement the TypeScript emitter:
1. Generate the contracts array with `as const`
2. Generate namespace declarations with types
3. Generate binding types and client factories
4. Produce valid, compilable TypeScript

## Prerequisites

- feature-namespace-builder (must be complete)
- epic-loader (must be complete)

## File Structure Target

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

## Implementation Guide

### Output Structure

The generated file follows this structure:

```typescript
// 1. Imports
import { FromSchema, ContractByName } from "@contracted/types";
import { create } from "@contracted/client";

// 2. Contracts array
export const contracts = [
  {
    name: "users:list",
    path: "/users",
    method: "GET",
    response: { type: "array", items: { $ref: "#/components/schemas/User" } } as const,
  },
  // ...
] as const;

// 3. Base types
export type Contracts = typeof contracts;
export type Contract = Contracts[number];
export type ContractName = Contract["name"];

// 4. Namespace declarations
export namespace Users {
  // Contract types
  export type ListContract = ContractByName<Contracts, "users:list">;
  export type CreateContract = ContractByName<Contracts, "users:create">;

  // Response types
  export type ListResponse = FromSchema<ListContract["response"]>;
  export type CreateResponse = FromSchema<CreateContract["response"]>;

  // Request types (if applicable)
  export type CreateRequest = FromSchema<CreateContract["request"]>;

  // Contract instances
  export const list = contracts.find(c => c.name === "users:list")!;
  export const create = contracts.find(c => c.name === "users:create")!;

  // Miniclient factory
  export const miniclient = () => ({
    list: create(list),
    create: create(create),
  });

  // Binding types
  export type Binding<T> = {
    "users:list": T;
    "users:create": T;
  };

  export type MiniBinding<T> = {
    list: T;
    create: T;
  };
}

// 5. Combined types
export type IContractCLI<T> = Users.Binding<T> & Posts.Binding<T>;
```

### Emitter Options

```typescript
export interface EmitterOptions {
  indent: string;           // "  " or "\t"
  importPath: string;       // "@contracted/types"
  clientImportPath: string; // "@contracted/client"
  includeBindings: boolean;
  includeMiniClient: boolean;
}

const defaultOptions: EmitterOptions = {
  indent: "  ",
  importPath: "@contracted/types",
  clientImportPath: "@contracted/client",
  includeBindings: true,
  includeMiniClient: true,
};
```

### Contract Object Emission

```typescript
function emitContractObject(contract: Contract, indent: string): string {
  const lines: string[] = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  name: "${contract.name}",`);
  lines.push(`${indent}  path: "${contract.path}",`);
  lines.push(`${indent}  method: "${contract.method}",`);

  if (contract.request) {
    lines.push(`${indent}  request: ${emitSchema(contract.request)} as const,`);
  }

  lines.push(`${indent}  response: ${emitSchema(contract.response)} as const,`);
  lines.push(`${indent}}`);

  return lines.join("\n");
}
```

### Namespace Block Emission

```typescript
function emitNamespace(node: NamespaceNode, options: EmitterOptions): string {
  const lines: string[] = [];
  const indent = options.indent;

  lines.push(`export namespace ${node.name} {`);

  // Contract types
  for (const contract of node.contracts) {
    const typeName = getContractTypeName(contract);
    lines.push(`${indent}export type ${typeName}Contract = ContractByName<Contracts, "${contract.name}">;`);
  }

  // Response types
  for (const contract of node.contracts) {
    const typeName = getContractTypeName(contract);
    lines.push(`${indent}export type ${typeName}Response = FromSchema<${typeName}Contract["response"]>;`);
  }

  // Request types (conditional)
  for (const contract of node.contracts) {
    if (contract.request) {
      const typeName = getContractTypeName(contract);
      lines.push(`${indent}export type ${typeName}Request = FromSchema<${typeName}Contract["request"]>;`);
    }
  }

  // ... more generation

  lines.push("}");
  return lines.join("\n");
}
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Check the checklist** - Refer to [FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)
4. **Valid TypeScript** - Output must compile
5. **as const assertions** - Critical for type inference
