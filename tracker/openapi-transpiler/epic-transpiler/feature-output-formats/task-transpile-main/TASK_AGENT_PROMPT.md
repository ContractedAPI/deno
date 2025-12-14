# Task: transpile-main - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-output-formats/task-transpile-main/task`

## Implementation
```typescript
import * as ts from './typescript-emitter.ts';
import * as openapi from './openapi-emitter.ts';

export function generateOutput(spec: Specification, format: OutputFormat, config: OutputConfig): string {
  switch (format) {
    case 'typescript':
      return ts.emit(spec, config.typescript);
    case 'openapi-yaml':
      return openapi.emit(spec, { ...config.openapi, format: 'yaml' });
    case 'openapi-json':
      return openapi.emit(spec, { ...config.openapi, format: 'json' });
  }
}

export async function transpile(spec: Specification, config: OutputConfig): Promise<TranspileResult> {
  const files: string[] = [];
  const errors: Error[] = [];

  for (const format of config.formats) {
    try {
      const content = generateOutput(spec, format, config);
      const path = determineOutputPath(format, config);
      await writeOutput(path, content);
      files.push(path);
    } catch (e) {
      errors.push(e as Error);
    }
  }

  return { success: errors.length === 0, files, errors };
}
```

## Commit
`feat: add main transpile orchestrator`
