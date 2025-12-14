# Feature: ref-resolution - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicLoader.FeatureRefResolution`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-loader/feature-ref-resolution/feature`

## Context

You are implementing `$ref` JSON pointer resolution for ContractedAPI specifications. This allows schemas to reference other schemas within the same document using JSON pointers.

## Your Role

Implement the reference resolution system:
1. Parse JSON pointer strings
2. Resolve local references within document
3. Detect and report circular references
4. Preserve external references for later processing

## Prerequisites

- feature-format-detection (must be complete)
- feature-glob-resolution (must be complete)

## File Structure Target

```
src/loader/
├── ref.ts              # $ref resolution logic
├── pointer.ts          # JSON pointer utilities
└── types.ts            # RefResolutionOptions
```

## Implementation Guide

### JSON Pointer Parsing

```typescript
// RFC 6901 JSON Pointer
export function parseJsonPointer(ref: string): string[] {
  if (!ref.startsWith("#/")) {
    throw new Error(`Invalid local ref: ${ref}`);
  }

  return ref
    .slice(2)                           // Remove #/
    .split("/")                         // Split by /
    .map(segment =>
      segment
        .replace(/~1/g, "/")            // Decode /
        .replace(/~0/g, "~")            // Decode ~
    );
}
```

### Pointer Resolution

```typescript
export function resolvePointer(
  pointer: string[],
  document: unknown
): unknown {
  let current: unknown = document;

  for (const segment of pointer) {
    if (typeof current !== "object" || current === null) {
      throw new Error(`Cannot resolve pointer: path not found at '${segment}'`);
    }

    if (Array.isArray(current)) {
      const index = parseInt(segment, 10);
      if (isNaN(index)) {
        throw new Error(`Invalid array index: ${segment}`);
      }
      current = current[index];
    } else {
      current = (current as Record<string, unknown>)[segment];
    }

    if (current === undefined) {
      throw new Error(`Pointer target not found: ${segment}`);
    }
  }

  return current;
}
```

### Reference Context

```typescript
export interface RefContext {
  document: unknown;
  visited: Set<string>;
}

export function createRefContext(document: unknown): RefContext {
  return {
    document,
    visited: new Set(),
  };
}
```

### Circular Detection

```typescript
export function resolveRef(
  ref: string,
  ctx: RefContext
): unknown {
  if (ctx.visited.has(ref)) {
    throw new Error(`Circular reference detected: ${ref}`);
  }

  const newCtx: RefContext = {
    document: ctx.document,
    visited: new Set([...ctx.visited, ref]),
  };

  const pointer = parseJsonPointer(ref);
  const resolved = resolvePointer(pointer, ctx.document);

  // Recursively resolve if result also has $ref
  return resolveRefs(resolved, newCtx);
}
```

### Recursive Resolution

```typescript
export function resolveRefs(
  data: unknown,
  ctx: RefContext
): unknown {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => resolveRefs(item, ctx));
  }

  const obj = data as Record<string, unknown>;

  if ("$ref" in obj && typeof obj.$ref === "string") {
    const ref = obj.$ref;

    // Only resolve local refs
    if (ref.startsWith("#/")) {
      return resolveRef(ref, ctx);
    }

    // Preserve external refs
    return obj;
  }

  // Recurse into object properties
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = resolveRefs(value, ctx);
  }
  return result;
}
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Check the checklist** - Refer to [FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)
4. **Handle escape sequences** - `~0` and `~1` per RFC 6901
5. **Preserve external refs** - Only resolve `#/` prefixed refs
