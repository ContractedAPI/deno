# Tracker Directory

This directory contains the hierarchical work tracking system for the ContractedAPI/deno project.

## Reference Project

The `openapi-transpiler` project is based on patterns from an existing implementation:

**Source**: `C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator`

Key reference files:

### Core Files
| File | ~Lines | Purpose |
|------|--------|---------|
| `contract.ts` | - | Original contract type definitions |
| `schema.ts` | - | FromSchema wrapper implementation |
| `transpile.ts` | 550 | TypeScript generation patterns |
| `loader.ts` | 406 | Format detection, `$include` processing |

### Server Files
| File | ~Lines | Purpose |
|------|--------|---------|
| `server/builder.ts` | 319 | Route building, **BuildPhase pattern** (critical) |
| `server/serve.ts` | 50 | HTTP server lifecycle management |
| `server/errors.ts` | 26 | Error classes (InvalidResponseError, SubrouteNotFoundError, CodedError) |
| `server/registry.ts` | 44 | Instance tracking singleton pattern |
| `server/types.ts` | 44 | ServerConfig, Instance types, constants |

### Client Files
| File | ~Lines | Purpose |
|------|--------|---------|
| `client/client.ts` | 137 | HTTP client with URL composition and method overloading |
| `client/utility.ts` | - | Contract lookup type patterns |

### Generated Output (Reference for Transpiler)
| File | ~Lines | Purpose |
|------|--------|---------|
| `contracts/api.ts` | 1990 | **GENERATED** - Shows expected TypeScript output format |

### Tests
| File | ~Lines | Purpose |
|------|--------|---------|
| `orchestrator_test.ts` | 2384 | Comprehensive test suite - valuable for understanding expected behaviors |

When working on any scope level, agents may reference these files for implementation patterns. See individual `*_RESEARCH.md` files for specific excerpts and adaptations.

## Structure

```
tracker/
  {project}/
    PROJECT_AGENT_PROMPT.md
    PROJECT_DESCRIPTION.md
    PROJECT_CHECKLIST.md
    PROJECT_RESEARCH.md
    PROJECT_REVIEW.md
    {epic}/
      EPIC_AGENT_PROMPT.md
      EPIC_DESCRIPTION.md
      EPIC_CHECKLIST.md
      EPIC_RESEARCH.md
      EPIC_REVIEW.md
      {feature}/
        FEATURE_AGENT_PROMPT.md
        FEATURE_DESCRIPTION.md
        FEATURE_CHECKLIST.md
        FEATURE_RESEARCH.md
        FEATURE_REVIEW.md
        {task}/
          TASK_AGENT_PROMPT.md
          TASK_DESCRIPTION.md
          TASK_CHECKLIST.md
          TASK_RESEARCH.md
          TASK_REVIEW.md
```

## Scope Levels

| Scope | Size | Description |
|-------|------|-------------|
| **Project** | Massive/XL PR | Feature-set level or entire-refactor level |
| **Epic** | Large PR | Major milestone within a project |
| **Feature** | Standard PR | Deliverable unit of functionality |
| **Task** | Macro-commit | Atomic unit of work (1-20 micro-commits) |

## File Purposes

| File | Purpose |
|------|---------|
| `*_AGENT_PROMPT.md` | Copy-paste ready instructions for coding agents |
| `*_DESCRIPTION.md` | Short description of the work item |
| `*_CHECKLIST.md` | Development checklist with Mermaid Gantt chart |
| `*_RESEARCH.md` | Prework and research aggregation |
| `*_REVIEW.md` | Code review documentation (populated when complete) |

## Workflow

1. **Initialize**: Create all five files for ONE scope level
2. **Research**: Populate research document with findings
3. **Plan**: Create checklist with Mermaid Gantt chart
4. **Delegate**: Use agent prompt to hand off to coding agent
5. **Review**: Complete review document when checklist is done
6. **Merge**: Rebase-merge to parent branch when review passes

See `.claude/agents/tracker-project-manager.md` for the full SOP.
