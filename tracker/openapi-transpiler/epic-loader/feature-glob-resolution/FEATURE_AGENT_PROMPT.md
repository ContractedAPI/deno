# Feature: glob-resolution - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicLoader.FeatureGlobResolution`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-loader/feature-glob-resolution/feature`

## Context

You are implementing glob pattern resolution for ContractedAPI's include syntax. The `#./pattern` syntax allows specification files to include multiple contract cards using glob patterns.

## Your Role

Implement the glob resolution system:
1. Detect glob patterns in specification keys
2. Expand patterns to file paths
3. Track import context for path/method inheritance
4. Prevent circular includes

## Prerequisites

- feature-format-detection (must be complete)

## File Structure Target

```
src/loader/
├── glob.ts             # Glob resolution logic
├── include.ts          # Include processing
└── types.ts            # GlobMatch, ContractCard types
```

## Implementation Guide

### Glob Detection

```typescript
const GLOB_PREFIX = "#./";

export function isGlobPattern(key: string): boolean {
  return key.startsWith(GLOB_PREFIX);
}

export function extractGlobPattern(key: string): string {
  return key.slice(GLOB_PREFIX.length);
}
```

### Pattern Expansion

```typescript
import { expandGlob } from "@std/fs";
import { resolve, dirname } from "@std/path";

export async function* expandGlobPattern(
  pattern: string,
  baseDir: string
): AsyncIterable<string> {
  const fullPattern = resolve(baseDir, pattern);

  for await (const entry of expandGlob(fullPattern)) {
    if (entry.isFile) {
      yield entry.path;
    }
  }
}
```

### Import Context

```typescript
export interface ImportContext {
  baseDir: string;
  pathOverride?: string;    // Path from parent
  methodOverride?: string;  // Method from parent
  visited: Set<string>;     // Circular detection
}

export function createContext(baseDir: string): ImportContext {
  return {
    baseDir,
    visited: new Set(),
  };
}

export function withPathOverride(ctx: ImportContext, path: string): ImportContext {
  return { ...ctx, pathOverride: path };
}

export function withMethodOverride(ctx: ImportContext, method: string): ImportContext {
  return { ...ctx, methodOverride: method };
}
```

### Circular Detection

```typescript
export function checkCircular(filePath: string, ctx: ImportContext): void {
  const normalized = normalizePath(filePath);

  if (ctx.visited.has(normalized)) {
    throw new Error(
      `Circular include detected: ${filePath}\n` +
      `Include chain: ${[...ctx.visited, normalized].join(" -> ")}`
    );
  }
}

export function markVisited(ctx: ImportContext, filePath: string): ImportContext {
  const normalized = normalizePath(filePath);
  return {
    ...ctx,
    visited: new Set([...ctx.visited, normalized]),
  };
}
```

### ContractCard Loading

```typescript
export async function loadContractCard(
  filePath: string,
  ctx: ImportContext
): Promise<ContractCard> {
  checkCircular(filePath, ctx);

  const newCtx = markVisited(ctx, filePath);
  const raw = await parseFile(filePath);

  return normalizeContractCard(raw, newCtx);
}

function normalizeContractCard(raw: unknown, ctx: ImportContext): ContractCard {
  // Validate structure
  // Apply path override if present
  // Apply method override if present
  // Return normalized card
}
```

## Import Location Rules

```typescript
function getEffectivePath(card: ContractCard, ctx: ImportContext): string {
  return ctx.pathOverride ?? card.path;
}

function getEffectiveMethod(card: ContractCard, ctx: ImportContext): string {
  return ctx.methodOverride ?? card.method;
}
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Check the checklist** - Refer to [FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)
4. **Normalize paths** - Use consistent path format for comparison
5. **Handle empty results** - Glob may match no files
