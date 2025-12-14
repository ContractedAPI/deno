# Task: contracts-array - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-typescript-emitter/task-contracts-array/task`

## Implementation
```typescript
export function emitContractObject(contract: Contract, indent: string): string {
  const lines: string[] = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}${indent}name: "${contract.name}",`);
  lines.push(`${indent}${indent}path: "${contract.path}",`);
  lines.push(`${indent}${indent}method: "${contract.method}",`);
  if (contract.request) {
    lines.push(`${indent}${indent}request: ${JSON.stringify(contract.request)},`);
  }
  lines.push(`${indent}${indent}response: ${JSON.stringify(contract.response)},`);
  lines.push(`${indent}}`);
  return lines.join('\n');
}

export function emitContractsArray(contracts: Contract[], options: EmitterOptions): string {
  const items = contracts.map(c => emitContractObject(c, options.indent));
  return `export const contracts = [\n${items.join(',\n')}\n] as const;`;
}
```

## Commit
`feat: add contracts array emitter`
