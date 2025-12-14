# Task: merge-strategies - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-component-merging/task-merge-strategies/task`

## Implementation

```typescript
export function mergeWithError(
  main: ComponentsObject,
  card: ComponentsObject,
  conflicts: Conflict[]
): void {
  if (conflicts.length > 0) {
    throw new Error(
      `Merge conflicts:\n${conflicts.map(c => `  ${c.type}/${c.name}`).join("\n")}`
    );
  }
  mergeComponents(main, card);
}

export function mergeWithFirstWins(
  main: ComponentsObject,
  card: ComponentsObject
): void {
  for (const [type, components] of Object.entries(card)) {
    main[type] ??= {};
    for (const [name, schema] of Object.entries(components ?? {})) {
      if (!(name in main[type]!)) {
        main[type]![name] = schema;
      }
    }
  }
}

export function mergeWithLastWins(
  main: ComponentsObject,
  card: ComponentsObject
): void {
  mergeComponents(main, card);
}

function mergeComponents(main: ComponentsObject, card: ComponentsObject): void {
  for (const [type, components] of Object.entries(card)) {
    main[type] ??= {};
    Object.assign(main[type]!, components);
  }
}
```

## Commit

`feat: add merge strategies`
