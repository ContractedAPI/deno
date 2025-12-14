# Task: parse-file - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-format-detection/task-parse-file/task`

## Implementation

```typescript
export async function parseFile(path: string): Promise<unknown> {
  const content = await Deno.readTextFile(path);
  if (!content.trim()) {
    return undefined;
  }
  const format = detectFormat(path);
  return parse(content, format);
}
```

## Commit

`feat: add parseFile function`
