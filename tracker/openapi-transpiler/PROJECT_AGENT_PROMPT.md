# Project: openapi-transpiler - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.Project`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/project`

## Context

You are working on the ContractedAPI IDL Transpiler project. This is a transpiler system for a custom Interface Definition Language (IDL) that is OpenAPI-adjacent but not strictly OpenAPI 3.

Your worktree is located at the path above. The root project is at the root location. If you need to reference files outside your worktree (such as the reference project), you may do so, but **always return to your worktree directory when done**.

## Your Role

As a coding agent at the project level, your responsibility is primarily to:
1. Set up project infrastructure (deno.json, directory structure, etc.)
2. Create shared utilities used across epics
3. Assist with integration issues that span multiple epics

**You are NOT responsible for implementing individual epics** - those will be handled by dedicated agents in their own worktrees.

## Reference Project

When you need patterns or implementation guidance, refer to:
- `C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator`

Key reference files:
- `transpile.ts` - TypeScript generation patterns
- `loader.ts` - Format detection, $include processing
- `contract.ts` - Original contract type definitions
- `server/builder.ts` - Route building from contracts

**Remember**: After viewing reference files, return to your worktree with `cd <worktree-path>`.

## File Structure Target

```
src/
├── spec/           # Type definitions (epic-spec-types)
├── loader/         # Loading and resolution (epic-loader)
├── transpiler/     # Transpilation engines (epic-transpiler)
├── schema/         # JSON Schema utilities (part of epic-spec-types)
├── server/         # REST server generation (epic-server)
├── client/         # Client foundation (epic-client)
├── cli/            # CLI entry point (epic-cli)
└── mcp/            # MCP integration (epic-mcp)
```

## Commit Guidelines

- Use conventional commit style (no scopes)
- Micro-commits: ~20 lines changed, max ~100 lines on outliers
- Format: `type: description`
  - `feat:` new features
  - `fix:` bug fixes
  - `docs:` documentation
  - `refactor:` code restructuring
  - `chore:` maintenance tasks

## Important Reminders

1. **Stay in your worktree** - Always return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Don't implement epics** - Focus on project-level infrastructure
4. **Check the checklist** - Refer to [PROJECT_CHECKLIST.md](./PROJECT_CHECKLIST.md) for your tasks
