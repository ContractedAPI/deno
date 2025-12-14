# Task: help-types - Agent Prompt

> **Branch**: `openapi-transpiler/epic-cli/feature-help-generator/task-help-types/task`

## Implementation
```typescript
export interface ParameterHelp {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  default?: string;
}

export interface HelpOptions {
  programName: string;
  includeExamples: boolean;
  colorize: boolean;
}
```

## Commit
`feat: add help generation types`
