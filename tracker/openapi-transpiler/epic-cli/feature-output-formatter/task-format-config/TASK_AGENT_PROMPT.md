# Task: format-config - Agent Prompt

> **Branch**: `openapi-transpiler/epic-cli/feature-output-formatter/task-format-config/task`

## Implementation
```typescript
export type CliOutputFormat = 'json' | 'table' | 'plain';

export interface FormatterOptions {
  format: CliOutputFormat;
  colorize: boolean;
  indent: number;
}

export const defaultFormatterOptions: FormatterOptions = {
  format: 'json',
  colorize: true,
  indent: 2,
};
```

## Commit
`feat: add output format config types`
