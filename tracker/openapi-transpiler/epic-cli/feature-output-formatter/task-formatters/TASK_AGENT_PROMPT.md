# Task: formatters - Agent Prompt

> **Branch**: `openapi-transpiler/epic-cli/feature-output-formatter/task-formatters/task`

## Implementation
```typescript
export function formatJson(data: unknown, options: FormatterOptions): string {
  return JSON.stringify(data, null, options.indent);
}

export function formatTable(data: unknown[], options: FormatterOptions): string {
  if (!data.length) return '(empty)';
  const keys = Object.keys(data[0] as object);
  const header = keys.join('\t');
  const rows = data.map(row =>
    keys.map(k => String((row as Record<string, unknown>)[k] ?? '')).join('\t')
  );
  return [header, ...rows].join('\n');
}

export function formatPlain(data: unknown): string {
  if (typeof data === 'string') return data;
  if (Array.isArray(data)) return data.join('\n');
  return String(data);
}

export function format(data: unknown, options: FormatterOptions): string {
  switch (options.format) {
    case 'json': return formatJson(data, options);
    case 'table': return formatTable(Array.isArray(data) ? data : [data], options);
    case 'plain': return formatPlain(data);
  }
}
```

## Commit
`feat: add output formatters`
