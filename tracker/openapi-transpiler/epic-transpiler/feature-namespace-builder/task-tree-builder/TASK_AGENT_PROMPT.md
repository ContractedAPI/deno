# Task: tree-builder - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-namespace-builder/task-tree-builder/task`

## Implementation
```typescript
export function buildNamespaceTree(contracts: Contract[]): NamespaceTree {
  const root = new Map<string, NamespaceNode>();

  for (const contract of contracts) {
    const segments = pathToSegments(contract.path);
    let current = root;

    for (let i = 0; i < segments.length; i++) {
      const name = segmentToNamespace(segments[i]);
      if (!current.has(name)) {
        current.set(name, { name, children: new Map(), contracts: [] });
      }
      const node = current.get(name)!;
      if (i === segments.length - 1) {
        node.contracts.push(contract);
      }
      current = node.children;
    }
  }

  return { root };
}

export function getNamespaceContracts(tree: NamespaceTree, namespace: string): Contract[] {
  const segments = namespace.split('.');
  let current = tree.root;

  for (const segment of segments) {
    const node = current.get(segment);
    if (!node) return [];
    if (segment === segments[segments.length - 1]) {
      return node.contracts;
    }
    current = node.children;
  }
  return [];
}
```

## Commit
`feat: add namespace tree builder functions`
