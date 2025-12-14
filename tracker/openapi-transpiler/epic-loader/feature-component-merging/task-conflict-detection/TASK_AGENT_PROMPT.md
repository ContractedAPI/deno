# Task: conflict-detection - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-component-merging/task-conflict-detection/task`

## Implementation

```typescript
export function areSchemasSame(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function detectConflicts(
  main: ComponentsObject,
  card: ComponentsObject,
  cardName: string
): Conflict[] {
  const conflicts: Conflict[] = [];

  for (const [type, components] of Object.entries(card)) {
    const mainComponents = main[type as keyof ComponentsObject] ?? {};

    for (const [name, schema] of Object.entries(components ?? {})) {
      if (name in mainComponents) {
        if (!areSchemasSame(mainComponents[name], schema)) {
          conflicts.push({
            type,
            name,
            cardName,
            reason: "different definition",
          });
        }
      }
    }
  }

  return conflicts;
}
```

## Commit

`feat: add conflict detection`
