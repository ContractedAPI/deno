# Epic: loader - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicLoader`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-loader/epic`

## Context

You are working on the loading and resolution system for ContractedAPI specifications. This epic is foundational - all other epics (transpiler, server, client, cli, mcp) depend on the loader producing correctly resolved contracts.

The loader must:
1. Parse spec files from YAML, JSON, and optionally TOML
2. Resolve glob patterns (`#./pattern/*.yaml`) for ContractCard imports
3. Resolve `$ref` references to components
4. Merge local components from ContractCards
5. Validate and normalize the loaded specification

## Your Role at Epic Level

At the epic level, your responsibilities are:
1. Set up the loader module structure
2. Coordinate shared utilities across features
3. Ensure consistent error handling patterns
4. Handle integration between features (format → glob → refs → merge → validate)

**Individual features are implemented by dedicated feature-level agents.**

## Prerequisites

This epic depends on **epic-spec-types** being complete. You will use:
- `Specification`, `Contract`, `ContractCard` types
- `ContractCardPath` type and `isContractCardPath()` guard
- `JSONSchema` and related types

## Reference Project

The reference implementation is at:
`C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator\loader.ts`

Key patterns to study:
- `detectFormat()` - File extension detection
- `processIncludes()` / `processIncludesSync()` - Recursive include resolution
- `resolveIncludePath()` - Relative path resolution
- `validateContract()` - Contract validation
- `loadWithBase()` - Base URL resolution for modules

**Key difference**: Reference uses `$include` for array flattening. Our loader uses `#./glob/pattern` with path/method override rules.

**Remember**: After viewing reference files, return to your worktree.

## File Structure Target

```
src/loader/
├── mod.ts              # Public exports: load, loadSync, loadWithBase
├── loader.ts           # Main orchestrator
├── format.ts           # Format detection: detectFormat, parseYaml, parseJson, parseToml
├── glob.ts             # Glob resolution: expandGlob, resolveContractCards
├── refs.ts             # $ref resolution: resolveRefs, detectCircular
├── components.ts       # Component merging: mergeComponents, detectConflicts
└── validate.ts         # Validation: validateSpec, validateContract
```

## Key Technical Decisions

1. **Glob library**: Use `@std/fs/expand-glob` or evaluate alternatives
2. **YAML parser**: Use `@std/yaml`
3. **Path handling**: Use `@std/path` for cross-platform support
4. **Error strategy**: Collect all errors vs fail-fast (recommend: collect for validation, fail-fast for loading)

## Glob Resolution Rules

When a glob pattern is encountered:

| Import Location | Path Used | Method Used |
|-----------------|-----------|-------------|
| Root `paths` key | Card's default path | Card's default method |
| Under a path | The path it's under | Card's default method |
| Under a method | The path it's under | The method it's under |

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines
- Format: `type: description` (feat, fix, docs, refactor, chore)

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Don't implement features** - Focus on epic-level coordination
4. **Check the checklist** - Refer to [EPIC_CHECKLIST.md](./EPIC_CHECKLIST.md)
