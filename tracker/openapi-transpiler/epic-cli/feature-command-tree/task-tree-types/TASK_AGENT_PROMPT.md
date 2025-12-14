# Task: tree-types - Agent Prompt

> **Branch**: `openapi-transpiler/epic-cli/feature-command-tree/task-tree-types/task`

## Implementation
```typescript
import type { Contract } from '../types/core.ts';

export interface CommandNode {
  name: string;
  description?: string;
  children: Map<string, CommandNode>;
  contract?: Contract;
  positionalArgs?: string[];
}

export interface CommandTree {
  root: Map<string, CommandNode>;
}
```

## Commit
`feat: add command tree types`
