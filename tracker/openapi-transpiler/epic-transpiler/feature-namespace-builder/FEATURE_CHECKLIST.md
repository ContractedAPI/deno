# Feature: namespace-builder - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: namespace-builder Implementation
    dateFormat  YYYY-MM-DD
    section Core
        Path parsing           :t1, 2025-01-01, 1d
        Namespace derivation   :t2, after t1, 2d
        Tree construction      :t3, after t2, 2d
    section Integration
        Contract grouping      :t4, after t3, 1d
        Edge case handling     :t5, after t4, 1d
    section Testing
        Unit tests             :t6, after t5, 1d
```

## Task Checklist

- [ ] Define `NamespaceNode` type
  - Name (PascalCase)
  - Children (nested namespaces)
  - Contracts (contracts at this level)
- [ ] Define `NamespaceTree` type
  - Root node collection
  - Lookup methods
- [ ] Create `pathToSegments(path: string): string[]`
  - Split on `/`
  - Filter empty strings
  - Preserve path parameters as segments
- [ ] Create `segmentToNamespace(segment: string): string`
  - PascalCase conversion
  - Handle path parameters (`{id}` → `Id` or `_id`)
  - Handle special characters
- [ ] Create `pathToNamespace(path: string): string`
  - Combine segments with `.`
  - Handle root path special case
- [ ] Create `buildNamespaceTree(contracts: Contract[]): NamespaceTree`
  - Group contracts by namespace
  - Build tree structure
  - Handle nesting
- [ ] Create `getNamespaceContracts(tree: NamespaceTree, namespace: string): Contract[]`
  - Lookup contracts by namespace
- [ ] Handle path parameter strategies
  - Flatten: `/users/{id}` → `Users`
  - Include: `/users/{id}` → `Users.Id`
  - Configurable option
- [ ] Handle edge cases
  - Root path `/`
  - Deep nesting `/a/b/c/d/e`
  - Mixed path params `/users/{id}/posts/{postId}`
- [ ] Write unit tests

## Acceptance Criteria

- [ ] All paths correctly converted
- [ ] Tree structure valid for code generation
- [ ] Contracts accessible by namespace
- [ ] Edge cases handled gracefully
