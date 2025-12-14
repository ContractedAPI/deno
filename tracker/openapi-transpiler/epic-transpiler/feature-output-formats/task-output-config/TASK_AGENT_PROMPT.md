# Task: output-config - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-output-formats/task-output-config/task`

## Implementation
```typescript
export type OutputFormat = 'typescript' | 'openapi-yaml' | 'openapi-json';

export interface OutputConfig {
  formats: OutputFormat[];
  outputDir: string;
  watch?: boolean;
  typescript?: Partial<EmitterOptions>;
  openapi?: Partial<OpenAPIEmitterOptions>;
}

export interface TranspileResult {
  success: boolean;
  files: string[];
  errors: Error[];
}
```

## Commit
`feat: add output configuration types`
