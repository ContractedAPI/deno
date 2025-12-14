# Task: merge-orchestrator - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-component-merging/task-merge-orchestrator/task`

## Implementation

```typescript
export function mergeAllComponents(
  spec: Specification,
  cards: ContractCard[],
  options: MergeOptions = DEFAULT_MERGE_OPTIONS
): Specification {
  spec.components ??= {};

  for (const card of cards) {
    if (!card.components) continue;

    const conflicts = detectConflicts(spec.components, card.components, card.name);

    switch (options.strategy) {
      case "error":
        mergeWithError(spec.components, card.components, conflicts);
        break;
      case "first-wins":
        mergeWithFirstWins(spec.components, card.components);
        break;
      case "last-wins":
        mergeWithLastWins(spec.components, card.components);
        break;
      case "namespace":
        // Implementation needed
        break;
    }
  }

  return spec;
}
```

## Commit

`feat: add merge orchestrator`
