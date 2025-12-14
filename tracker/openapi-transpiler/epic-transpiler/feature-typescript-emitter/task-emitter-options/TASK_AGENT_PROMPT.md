# Task: emitter-options - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-typescript-emitter/task-emitter-options/task`

## Implementation
```typescript
export interface EmitterOptions {
  indent: string;
  importPath: string;
  includeBindingTypes: boolean;
  includeClientFactory: boolean;
}

export const defaultEmitterOptions: EmitterOptions = {
  indent: '  ',
  importPath: 'contractedapi',
  includeBindingTypes: true,
  includeClientFactory: true,
};
```

## Commit
`feat: add TypeScript emitter options type`
