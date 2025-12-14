# Task: file-writer - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-output-formats/task-file-writer/task`

## Implementation
```typescript
import { ensureDir as ensureDirFs } from '@std/fs';
import { join, dirname } from '@std/path';

const FILE_NAMES: Record<OutputFormat, string> = {
  'typescript': 'contracts.ts',
  'openapi-yaml': 'openapi.yaml',
  'openapi-json': 'openapi.json',
};

export function determineOutputPath(format: OutputFormat, config: OutputConfig): string {
  return join(config.outputDir, FILE_NAMES[format]);
}

export async function ensureDir(path: string): Promise<void> {
  await ensureDirFs(dirname(path));
}

export async function writeOutput(path: string, content: string): Promise<void> {
  await ensureDir(path);
  await Deno.writeTextFile(path, content);
}
```

## Commit
`feat: add file writing utilities`
