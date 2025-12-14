# Task: format-types - Agent Prompt

> **Worktree Location**: (to be created when work commences)
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-loader/feature-format-detection/task-format-types/task`

## Your Task

Create `src/loader/format.ts` with format types.

## Implementation

```typescript
// src/loader/format.ts

/** Supported file formats. */
export type Format = "json" | "yaml" | "toml";

/** Map file extensions to formats. */
export const EXTENSION_MAP: Record<string, Format> = {
  ".json": "json",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".toml": "toml",
};

/** Supported extensions. */
export const SUPPORTED_EXTENSIONS = Object.keys(EXTENSION_MAP);
```

## Commit

`feat: add format type definitions`
