# Feature: format-detection - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicLoader.FeatureFormatDetection`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-loader/feature-format-detection/feature`

## Context

You are implementing file format detection and multi-format parsing for ContractedAPI specification files. This is a foundational feature that other loader features depend on.

## Your Role

Implement the format detection and parsing utilities:
1. File extension to format type mapping
2. Parser wrappers for YAML, JSON, and TOML
3. Unified parsing interface

## Prerequisites

- None (this is a foundational feature)

## File Structure Target

```
src/loader/
├── format.ts           # Format detection and parsing
└── types.ts            # Format type definitions
```

## Implementation Guide

### Format Type

```typescript
// src/loader/types.ts
export type Format = "json" | "yaml" | "toml";
```

### Extension Detection

```typescript
// src/loader/format.ts
export function detectFormat(path: string): Format {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "yaml":
    case "yml":
      return "yaml";
    case "toml":
      return "toml";
    case "json":
      return "json";
    default:
      throw new Error(`Unknown file extension: .${ext}`);
  }
}
```

### Parser Integration

```typescript
import { parse as parseYamlLib } from "@std/yaml";
import { parse as parseTomlLib } from "@std/toml";

export function parseYaml(content: string): unknown {
  return parseYamlLib(content);
}

export function parseToml(content: string): unknown {
  return parseTomlLib(content);
}

export function parseJson(content: string): unknown {
  return JSON.parse(content);
}
```

### Unified Interface

```typescript
export function parse(content: string, format: Format): unknown {
  switch (format) {
    case "yaml":
      return parseYaml(content);
    case "toml":
      return parseToml(content);
    case "json":
      return parseJson(content);
  }
}

export async function parseFile(path: string): Promise<unknown> {
  const content = await Deno.readTextFile(path);
  const format = detectFormat(path);
  return parse(content, format);
}
```

## Error Handling

Wrap parser errors with context:

```typescript
export function parse(content: string, format: Format, filePath?: string): unknown {
  try {
    switch (format) {
      case "yaml":
        return parseYaml(content);
      // ...
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      filePath
        ? `Failed to parse ${filePath}: ${message}`
        : `Failed to parse ${format}: ${message}`
    );
  }
}
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines
- Format: `type: description`

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Check the checklist** - Refer to [FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)
4. **Test all formats** - Ensure YAML, JSON, and TOML all work
5. **Handle edge cases** - Empty files, invalid syntax, etc.
