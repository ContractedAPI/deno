# Task: card-loading - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-glob-resolution/task-card-loading/task`

## Implementation

```typescript
export async function processGlobImport(
  pattern: string,
  context: ImportContext
): Promise<ContractCard[]> {
  const cards: ContractCard[] = [];

  for await (const file of expandGlobPattern(pattern, context.baseDir)) {
    if (context.visited.has(file)) {
      throw new Error(`Circular import detected: ${file}`);
    }
    context.visited.add(file);

    const data = await parseFile(file);
    const card = normalizeContractCard(data, context);
    cards.push(card);
  }

  return cards;
}

export function normalizeContractCard(
  data: unknown,
  context: ImportContext
): ContractCard {
  const card = data as ContractCard;
  return {
    ...card,
    path: context.pathOverride ?? card.path,
    method: context.methodOverride ?? card.method,
  };
}
```

## Commit

`feat: add ContractCard loading`
