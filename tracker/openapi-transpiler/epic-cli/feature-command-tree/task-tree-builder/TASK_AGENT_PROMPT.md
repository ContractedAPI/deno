# Task: tree-builder - Agent Prompt

> **Branch**: `openapi-transpiler/epic-cli/feature-command-tree/task-tree-builder/task`

## Implementation
```typescript
export function buildCommandTree(contracts: Contract[]): CommandTree {
  const root = new Map<string, CommandNode>();

  for (const contract of contracts) {
    const segments = contract.path.split('/').filter(Boolean);
    const positionalArgs: string[] = [];
    let current = root;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      if (segment.startsWith('{') && segment.endsWith('}')) {
        positionalArgs.push(segment.slice(1, -1));
        continue;
      }

      if (!current.has(segment)) {
        current.set(segment, {
          name: segment,
          children: new Map(),
        });
      }
      const node = current.get(segment)!;

      if (i === segments.length - 1) {
        const methodName = contract.method.toLowerCase();
        node.children.set(methodName, {
          name: methodName,
          children: new Map(),
          contract,
          positionalArgs,
        });
      }

      current = node.children;
    }
  }

  return { root };
}
```

## Commit
`feat: add command tree builder`
