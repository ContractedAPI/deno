# Task: detect-format - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-format-detection/task-detect-format/task`

## Implementation

```typescript
import { extname } from "@std/path";

export function detectFormat(path: string): Format {
  const ext = extname(path).toLowerCase();
  const format = EXTENSION_MAP[ext];
  if (!format) {
    throw new Error(`Unsupported file format: ${ext} (file: ${path})`);
  }
  return format;
}
```

## Commit

`feat: add format detection function`
