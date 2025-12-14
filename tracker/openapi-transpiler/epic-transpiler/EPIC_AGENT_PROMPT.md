# Epic: transpiler - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicTranspiler`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-transpiler/epic`

## Context

You are working on the transpilation engines for ContractedAPI. The transpiler converts loaded specifications into:
1. TypeScript code with typed contracts, namespace exports, and client factories
2. OpenAPI 3.1 YAML/JSON output for external tooling compatibility (one-way generation from ContractedAPI)

This is a code generation epic - you'll be building string templates and AST manipulation to produce output files.

## Your Role at Epic Level

At the epic level, your responsibilities are:
1. Set up the transpiler module structure
2. Define the code generation pipeline
3. Coordinate shared utilities (string formatting, indentation, etc.)
4. Handle integration between features

**Individual features are implemented by dedicated feature-level agents.**

## Prerequisites

This epic depends on:
- **epic-spec-types** (must be complete) - Type definitions
- **epic-loader** (must be complete) - Loaded and resolved contracts

You will consume `ResolvedSpecification` from the loader and produce TypeScript/OpenAPI files.

## Reference Project

The reference implementation is at:
`C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator\transpile.ts` (~550 lines)

The generated output to study is:
`C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator\contracts\api.ts` (~1990 lines)

Key patterns:
- Contract array generation with `as const`
- Namespace generation with types and instances
- Binding type generation
- Client factory pattern

**Remember**: After viewing reference files, return to your worktree.

## File Structure Target

```
src/transpiler/
├── mod.ts              # Public exports: transpile, transpileToOpenAPI
├── transpiler.ts       # Main orchestrator
├── namespace.ts        # Path → namespace conversion utilities
├── contracts.ts        # Contract array codegen
├── namespaces.ts       # Namespace block codegen
├── combined.ts         # Combined types codegen
├── openapi.ts          # OpenAPI 3.1 output
└── format.ts           # Indentation, string utilities
```

## Key Technical Decisions

1. **Code generation approach**: Template strings (simpler) vs AST builders (more robust)
2. **Formatting**: Manual indentation vs Prettier post-processing
3. **Namespace derivation**: Path-based (new) vs name-based (reference)
4. **Path parameters**: Flatten to parent namespace vs create sub-namespace

## Namespace Derivation Rules

Convert URL paths to TypeScript namespaces:

```
/api/users      → Api.Users
/api/users/{id} → Api.Users (flatten) OR Api.Users.Id (sub-namespace)
/auth/login     → Auth
/               → Root
```

**Conversion algorithm:**
1. Split path on `/`
2. Filter empty segments
3. PascalCase each segment
4. Handle `{param}` segments per chosen strategy
5. Join with `.` for nested namespaces

## Generated Output Structure

```typescript
// 1. Imports
import { FromSchema, ContractByName } from "./schema";

// 2. Contracts array
export const contracts = [ ... ] as const;

// 3. Base types
export type Contracts = typeof contracts;
export type Contract = Contracts[number];

// 4. Per-namespace blocks
export namespace Users {
  export type ListContract = ContractByName<Contracts, "user:list">;
  export type ListResponse = FromSchema<ListContract["response"]>;
  export const list = contracts.find(c => c.name === "user:list")!;
  export const miniclient = () => ({ ... });
  export type Binding<T> = { ... };
}

// 5. Combined types
export type IContractCLI<T> = Users.Binding<T> & ...;
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines
- Format: `type: description` (feat, fix, docs, refactor, chore)

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Don't implement features** - Focus on epic-level coordination
4. **Check the checklist** - Refer to [EPIC_CHECKLIST.md](./EPIC_CHECKLIST.md)
5. **Test generated output** - Ensure it compiles with `deno check`
