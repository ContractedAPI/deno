# Feature: output-formats

## Overview

Implement unified output format handling for the transpiler. This feature coordinates the TypeScript and OpenAPI emitters, manages file writing, and supports multiple output configurations.

## Key Deliverables

- Unified transpiler output interface
- Multi-format output coordination
- File system writing utilities
- Watch mode support
- Output path configuration

## File Structure

```
src/transpiler/
├── output.ts           # Output coordination
├── writer.ts           # File system utilities
├── watch.ts            # Watch mode implementation
└── types.ts            # OutputConfig, OutputFormat types
```

## Dependencies

### External
- `@std/fs` - File system operations

### Internal
- feature-namespace-builder (namespace structure)
- feature-typescript-emitter (TypeScript output)
- feature-openapi-emitter (OpenAPI output)

## Dependents

- epic-cli (uses transpiler output)
- epic-mcp (uses transpiler output)

## Key Patterns

### Output Configuration

```typescript
interface OutputConfig {
  formats: OutputFormat[];
  outDir: string;
  typescript?: {
    filename: string;    // "api.ts"
  };
  openapi?: {
    filename: string;    // "openapi.yaml"
    format: "yaml" | "json";
  };
  watch?: boolean;
}

type OutputFormat = "typescript" | "openapi-yaml" | "openapi-json";
```

### Multi-Format Output

```typescript
await transpile(spec, {
  formats: ["typescript", "openapi-yaml"],
  outDir: "./generated",
});

// Creates:
// ./generated/api.ts
// ./generated/openapi.yaml
```

## Acceptance Criteria

- [ ] Supports TypeScript output
- [ ] Supports OpenAPI YAML output
- [ ] Supports OpenAPI JSON output
- [ ] Writes files to configured paths
- [ ] Watch mode detects changes
- [ ] Handles write errors gracefully
