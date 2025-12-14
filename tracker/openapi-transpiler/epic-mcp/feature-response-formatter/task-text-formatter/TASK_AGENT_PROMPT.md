# Task: text-formatter - Agent Prompt

> **Branch**: `openapi-transpiler/epic-mcp/feature-response-formatter/task-text-formatter/task`

## Implementation
```typescript
const MAX_RESPONSE_LENGTH = 50000;

export function formatResponse(data: unknown, maxLength = MAX_RESPONSE_LENGTH): string {
  const formatted = formatValue(data, 0);
  if (formatted.length > maxLength) {
    return formatted.slice(0, maxLength) + '\n... (truncated)';
  }
  return formatted;
}

function formatValue(value: unknown, depth: number): string {
  const indent = '  '.repeat(depth);

  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (Array.isArray(value)) {
    if (value.length === 0) return '(empty array)';
    return value.map((item, i) =>
      `${indent}[${i + 1}] ${formatValue(item, depth + 1)}`
    ).join('\n');
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '(empty object)';
    return entries.map(([k, v]) =>
      `${indent}${k}: ${formatValue(v, depth + 1)}`
    ).join('\n');
  }

  return String(value);
}
```

## Commit
`feat: add MCP response text formatter`
