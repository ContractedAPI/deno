# Task: combined-emitter - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-typescript-emitter/task-combined-emitter/task`

## Implementation
```typescript
export function emitImports(options: EmitterOptions): string {
  return `import { FromSchema, ContractByName, create } from "${options.importPath}";`;
}

export function emitBaseTypes(): string {
  return [
    'export type Contracts = typeof contracts;',
    'export type Contract = Contracts[number];',
    'export type ContractName = Contract["name"];',
  ].join('\n');
}

export function emit(spec: Specification, options: Partial<EmitterOptions> = {}): string {
  const opts = { ...defaultEmitterOptions, ...options };
  const tree = buildNamespaceTree(spec.contracts);
  const sections: string[] = [];

  sections.push(emitImports(opts));
  sections.push('');
  sections.push(emitContractsArray(spec.contracts, opts));
  sections.push('');
  sections.push(emitBaseTypes());
  sections.push('');

  for (const node of tree.root.values()) {
    sections.push(emitNamespace(node, opts));
  }

  return sections.join('\n');
}
```

## Commit
`feat: add main TypeScript emit orchestrator`
