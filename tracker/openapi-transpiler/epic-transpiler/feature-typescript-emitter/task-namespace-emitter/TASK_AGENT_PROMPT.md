# Task: namespace-emitter - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-typescript-emitter/task-namespace-emitter/task`

## Implementation
```typescript
export function emitContractType(contract: Contract, indent: string): string {
  return `${indent}export type ${contract.name}Contract = ContractByName<Contracts, "${contract.name}">;`;
}

export function emitResponseType(contract: Contract, indent: string): string {
  return `${indent}export type ${contract.name}Response = FromSchema<${contract.name}Contract["response"]>;`;
}

export function emitNamespace(node: NamespaceNode, options: EmitterOptions, depth = 0): string {
  const indent = options.indent.repeat(depth);
  const inner = options.indent.repeat(depth + 1);
  const lines: string[] = [];

  lines.push(`${indent}export namespace ${node.name} {`);

  for (const contract of node.contracts) {
    lines.push(emitContractType(contract, inner));
    lines.push(emitResponseType(contract, inner));
  }

  for (const child of node.children.values()) {
    lines.push(emitNamespace(child, options, depth + 1));
  }

  lines.push(`${indent}}`);
  return lines.join('\n');
}
```

## Commit
`feat: add namespace emitter functions`
