# Task: validation - Agent Prompt

> **Branch**: `openapi-transpiler/epic-cli/feature-argument-parser/task-validation/task`

## Implementation
```typescript
export function coerceValue(value: string, type: CliArg['type']): unknown {
  switch (type) {
    case 'number': return Number(value);
    case 'boolean': return value === 'true' || value === '1';
    case 'array': return value.split(',');
    default: return value;
  }
}

export function parseArgs(
  args: CliArg[],
  values: Record<string, string>
): { data: Record<string, unknown>; errors: string[] } {
  const data: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const arg of args) {
    const value = values[arg.name];

    if (value === undefined) {
      if (arg.required) {
        errors.push(`Missing required argument: --${arg.name}`);
      } else if (arg.default !== undefined) {
        data[arg.name] = arg.default;
      }
      continue;
    }

    data[arg.name] = coerceValue(value, arg.type);
  }

  return { data, errors };
}
```

## Commit
`feat: add argument parsing and validation`
