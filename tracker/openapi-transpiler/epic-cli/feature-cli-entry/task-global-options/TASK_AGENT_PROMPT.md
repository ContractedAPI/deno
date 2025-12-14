# Task: global-options - Agent Prompt

> **Branch**: `openapi-transpiler/epic-cli/feature-cli-entry/task-global-options/task`

## Implementation
```typescript
export interface GlobalOptions {
  baseUrl: string;
  config?: string;
  output: CliOutputFormat;
  verbose: boolean;
  noColor: boolean;
}

export const globalOptionDefs = {
  baseUrl: {
    type: 'string',
    short: 'u',
    description: 'Base URL for API requests',
    env: 'API_BASE_URL',
  },
  config: {
    type: 'string',
    short: 'c',
    description: 'Path to config file',
  },
  output: {
    type: 'string',
    short: 'o',
    description: 'Output format (json, table, plain)',
    default: 'json',
  },
  verbose: {
    type: 'boolean',
    short: 'v',
    description: 'Enable verbose output',
    default: false,
  },
  noColor: {
    type: 'boolean',
    description: 'Disable colored output',
    default: false,
  },
} as const;
```

## Commit
`feat: add global CLI options`
