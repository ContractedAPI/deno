# Feature: command-tree - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicCli.FeatureCommandTree`
> **Branch**: `openapi-transpiler/epic-cli/feature-command-tree/feature`

## Context

Implement command tree generation from contract paths.

## Key Pattern

```
/users          → contracted users
/users/{id}     → contracted users <id>
GET /users      → contracted users list
POST /users     → contracted users create
```
