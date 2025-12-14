# Epic: spec-types - Agent Prompt

> **Note**: This document provides context for the epic level. Individual features will have their own agent prompts with specific implementation instructions.

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-spec-types/epic`

## Context

You are working on the foundation types for the ContractedAPI IDL Transpiler. This epic establishes the core type system that all other epics will depend on.

ContractedAPI is an OpenAPI-adjacent IDL that:
- Supports multiple named contracts per path+method (request schema routing)
- Uses glob patterns for modular ContractCard imports
- Generates typed function signatures for CLI, MCP, REST clients/servers

## Your Role at Epic Level

At the epic level, your responsibilities are:
1. Coordinate shared patterns across features
2. Ensure type consistency between features
3. Handle integration issues between features
4. Set up shared infrastructure (if needed)

**Individual features are implemented by dedicated feature-level agents.**

## File Structure Target

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

## Key Technical Decisions

1. **json-schema-to-ts** for compile-time type inference from JSON Schema
2. **Ajv** for runtime validation (optional peer dependency)
3. **Field aliases** for OpenAPI compatibility (contractedapi/openapi, spec/paths, events/webhooks)
4. **FromSchema wrapper** with `& JSONObject` correction for object types

## Reference Project

When you need implementation patterns, refer to:
- `C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator`

**Remember**: After viewing reference files, return to your worktree.

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines
- Format: `type: description` (feat, fix, docs, refactor, chore)

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Don't implement features** - Focus on epic-level coordination
4. **Check the checklist** - Refer to [EPIC_CHECKLIST.md](./EPIC_CHECKLIST.md)
