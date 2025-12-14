# Task: pattern-expansion - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-glob-resolution/task-pattern-expansion/task`

## Implementation

```typescript
import { expandGlob } from "@std/fs";
import { join } from "@std/path";

export async function* expandGlobPattern(
  pattern: string,
  baseDir: string
): AsyncIterable<string> {
  const cleanPattern = pattern.replace(/^#\.?\//, "");
  const fullPattern = join(baseDir, cleanPattern);

  for await (const entry of expandGlob(fullPattern)) {
    if (entry.isFile) {
      yield entry.path;
    }
  }
}
```

## Commit

`feat: add glob pattern expansion`
