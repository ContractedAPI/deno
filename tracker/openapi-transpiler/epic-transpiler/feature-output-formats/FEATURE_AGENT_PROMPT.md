# Feature: output-formats - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicTranspiler.FeatureOutputFormats`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-transpiler/feature-output-formats/feature`

## Context

You are implementing the output coordination layer for the ContractedAPI transpiler. This feature ties together the TypeScript and OpenAPI emitters and handles file system operations.

## Your Role

Implement the output coordination:
1. Unified transpiler interface
2. Multi-format output generation
3. File system writing utilities
4. Watch mode for development

## Prerequisites

- feature-namespace-builder (must be complete)
- feature-typescript-emitter (must be complete)
- feature-openapi-emitter (must be complete)

## File Structure Target

```
src/transpiler/
├── output.ts           # Output coordination
├── writer.ts           # File system utilities
├── watch.ts            # Watch mode implementation
└── types.ts            # OutputConfig, OutputFormat types
```

## Implementation Guide

### Types

```typescript
export type OutputFormat = "typescript" | "openapi-yaml" | "openapi-json";

export interface OutputConfig {
  formats: OutputFormat[];
  outDir: string;
  typescript?: {
    filename?: string;  // Default: "api.ts"
  };
  openapi?: {
    filename?: string;  // Default: "openapi.yaml" or "openapi.json"
  };
  watch?: boolean;
}

export interface TranspileResult {
  success: boolean;
  files: Array<{
    path: string;
    format: OutputFormat;
    size: number;
  }>;
  errors: Error[];
  duration: number;
}
```

### Main Transpile Function

```typescript
export async function transpile(
  spec: Specification,
  config: OutputConfig
): Promise<TranspileResult> {
  const startTime = Date.now();
  const files: TranspileResult["files"] = [];
  const errors: Error[] = [];

  for (const format of config.formats) {
    try {
      const content = generateOutput(spec, format);
      const path = determineOutputPath(format, config);

      await writeOutput(path, content);

      files.push({
        path,
        format,
        size: new TextEncoder().encode(content).length,
      });
    } catch (error) {
      errors.push(error instanceof Error ? error : new Error(String(error)));
    }
  }

  return {
    success: errors.length === 0,
    files,
    errors,
    duration: Date.now() - startTime,
  };
}
```

### Output Generation

```typescript
function generateOutput(spec: Specification, format: OutputFormat): string {
  switch (format) {
    case "typescript":
      return emitTypeScript(spec);

    case "openapi-yaml":
      return emitOpenAPI(spec, { format: "yaml" });

    case "openapi-json":
      return emitOpenAPI(spec, { format: "json" });

    default:
      throw new Error(`Unknown format: ${format}`);
  }
}
```

### Path Determination

```typescript
function determineOutputPath(format: OutputFormat, config: OutputConfig): string {
  const base = config.outDir;

  switch (format) {
    case "typescript":
      return join(base, config.typescript?.filename ?? "api.ts");

    case "openapi-yaml":
      return join(base, config.openapi?.filename ?? "openapi.yaml");

    case "openapi-json":
      return join(base, config.openapi?.filename ?? "openapi.json");
  }
}
```

### File Writing

```typescript
import { ensureDir } from "@std/fs";
import { dirname } from "@std/path";

async function writeOutput(path: string, content: string): Promise<void> {
  // Ensure directory exists
  await ensureDir(dirname(path));

  // Write atomically (write to temp, then rename)
  const tempPath = `${path}.tmp`;
  await Deno.writeTextFile(tempPath, content);
  await Deno.rename(tempPath, path);
}
```

### Watch Mode

```typescript
export async function watchAndTranspile(
  specPath: string,
  config: OutputConfig
): Promise<void> {
  const watcher = Deno.watchFs(specPath);

  console.log(`Watching ${specPath} for changes...`);

  // Initial transpile
  const spec = await loadSpec(specPath);
  await transpile(spec, config);

  // Watch for changes
  let debounceTimer: number | undefined;

  for await (const event of watcher) {
    if (event.kind === "modify") {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        console.log("Change detected, transpiling...");
        const spec = await loadSpec(specPath);
        const result = await transpile(spec, config);
        console.log(`Transpiled ${result.files.length} files in ${result.duration}ms`);
      }, 100);
    }
  }
}
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Check the checklist** - Refer to [FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)
4. **Atomic writes** - Prevent partial file writes
5. **Handle errors** - Don't crash on single format failure
