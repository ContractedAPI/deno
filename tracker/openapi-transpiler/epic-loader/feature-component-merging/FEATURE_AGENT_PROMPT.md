# Feature: component-merging - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicLoader.FeatureComponentMerging`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-loader/feature-component-merging/feature`

## Context

You are implementing component merging for ContractedAPI specifications. When multiple ContractCards define local components, they must be merged into the main specification while handling conflicts appropriately.

## Your Role

Implement the component merging system:
1. Extract components from loaded cards
2. Detect conflicts between cards and main spec
3. Apply merge strategy to resolve conflicts
4. Update internal references when namespacing

## Prerequisites

- feature-format-detection (must be complete)
- feature-glob-resolution (must be complete)
- feature-ref-resolution (must be complete)

## File Structure Target

```
src/loader/
├── merge.ts            # Component merging logic
├── conflict.ts         # Conflict detection
└── types.ts            # MergeStrategy, MergeOptions
```

## Implementation Guide

### Types

```typescript
export type MergeStrategy = "error" | "namespace" | "first-wins" | "last-wins";

export interface MergeOptions {
  strategy: MergeStrategy;
  namespaceSeparator?: string;  // Default: "_"
}

export interface Conflict {
  type: string;        // "schemas" | "responses" | etc.
  name: string;        // Component name
  cardName: string;    // Source card
  reason: string;      // "different definition" | etc.
}
```

### Component Extraction

```typescript
export function extractComponents(card: ContractCard): ComponentsObject {
  return card.components ?? {};
}
```

### Conflict Detection

```typescript
export function detectConflicts(
  main: ComponentsObject,
  card: ComponentsObject,
  cardName: string
): Conflict[] {
  const conflicts: Conflict[] = [];

  for (const [type, components] of Object.entries(card)) {
    if (!main[type]) continue;

    for (const [name, schema] of Object.entries(components)) {
      if (main[type][name]) {
        if (!areSchemasSame(main[type][name], schema)) {
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

### Merge Implementation

```typescript
export function mergeComponents(
  spec: Specification,
  cards: ContractCard[],
  options: MergeOptions
): Specification {
  const result = { ...spec };
  result.components = { ...spec.components };

  for (const card of cards) {
    const cardComponents = extractComponents(card);
    const conflicts = detectConflicts(result.components, cardComponents, card.name);

    switch (options.strategy) {
      case "error":
        if (conflicts.length > 0) {
          throw new MergeConflictError(conflicts);
        }
        mergeNoConflict(result.components, cardComponents);
        break;

      case "namespace":
        mergeWithNamespace(result, card, cardComponents, conflicts, options);
        break;

      case "first-wins":
        mergeFirstWins(result.components, cardComponents);
        break;

      case "last-wins":
        mergeLastWins(result.components, cardComponents);
        break;
    }
  }

  return result;
}
```

### Reference Updating

When namespacing, update refs:

```typescript
function updateRefsInCard(
  card: ContractCard,
  renames: Map<string, string>  // old -> new
): ContractCard {
  return JSON.parse(
    JSON.stringify(card),
    (key, value) => {
      if (key === "$ref" && typeof value === "string") {
        for (const [oldName, newName] of renames) {
          if (value.includes(oldName)) {
            return value.replace(oldName, newName);
          }
        }
      }
      return value;
    }
  );
}
```

## Merge Strategy Details

### Error Strategy

```typescript
if (conflicts.length > 0) {
  const details = conflicts
    .map(c => `  - ${c.type}/${c.name} (from ${c.cardName}): ${c.reason}`)
    .join("\n");
  throw new Error(`Component merge conflicts:\n${details}`);
}
```

### Namespace Strategy

```typescript
const sep = options.namespaceSeparator ?? "_";
const newName = `${cardName}${sep}${originalName}`;

// Update refs to point to new name
const oldRef = `#/components/${type}/${originalName}`;
const newRef = `#/components/${type}/${newName}`;
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Check the checklist** - Refer to [FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)
4. **Deep equality** - Schema comparison must be thorough
5. **Ref consistency** - All refs must be updated when namespacing
