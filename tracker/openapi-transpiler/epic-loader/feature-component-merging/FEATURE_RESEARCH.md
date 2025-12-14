# Feature: component-merging - Research

## Component Merge Scenarios

### No Conflict

Component doesn't exist in main spec:

```yaml
# Main spec
components:
  schemas:
    User: { type: object }

# Card components
components:
  schemas:
    Post: { type: object }  # New - just add

# Result
components:
  schemas:
    User: { type: object }
    Post: { type: object }
```

### Same Definition

Component exists with identical schema:

```yaml
# Main spec
components:
  schemas:
    User:
      type: object
      properties:
        name: { type: string }

# Card components
components:
  schemas:
    User:  # Same definition - no conflict
      type: object
      properties:
        name: { type: string }
```

### Different Definition (Conflict)

Component exists with different schema:

```yaml
# Main spec
components:
  schemas:
    User:
      type: object
      properties:
        name: { type: string }

# Card components
components:
  schemas:
    User:  # CONFLICT - different properties
      type: object
      properties:
        id: { type: integer }
        name: { type: string }
```

## Merge Strategy Implementation

### Error Strategy

```typescript
function mergeWithError(
  main: ComponentsObject,
  card: ComponentsObject,
  cardName: string
): void {
  const conflicts = detectConflicts(main, card, cardName);

  if (conflicts.length > 0) {
    throw new MergeConflictError(
      `Cannot merge components from ${cardName}:\n` +
      conflicts.map(c =>
        `  - ${c.type}/${c.name}: ${c.reason}`
      ).join("\n")
    );
  }

  // No conflicts - safe to merge
  for (const [type, components] of Object.entries(card)) {
    if (!main[type]) main[type] = {};
    Object.assign(main[type], components);
  }
}
```

### Namespace Strategy

```typescript
function mergeWithNamespace(
  spec: Specification,
  card: ContractCard,
  cardComponents: ComponentsObject,
  conflicts: Conflict[],
  options: MergeOptions
): void {
  const sep = options.namespaceSeparator ?? "_";
  const renames = new Map<string, string>();

  // Identify renames needed
  for (const conflict of conflicts) {
    const oldName = conflict.name;
    const newName = `${card.name}${sep}${oldName}`;
    renames.set(
      `#/components/${conflict.type}/${oldName}`,
      `#/components/${conflict.type}/${newName}`
    );
  }

  // Update refs in card
  const updatedCard = updateRefs(card, renames);

  // Merge with renamed components
  for (const [type, components] of Object.entries(cardComponents)) {
    if (!spec.components[type]) spec.components[type] = {};

    for (const [name, schema] of Object.entries(components)) {
      const isConflict = conflicts.some(c => c.type === type && c.name === name);
      const finalName = isConflict ? `${card.name}${sep}${name}` : name;
      spec.components[type][finalName] = schema;
    }
  }
}
```

### First-Wins Strategy

```typescript
function mergeFirstWins(
  main: ComponentsObject,
  card: ComponentsObject
): void {
  for (const [type, components] of Object.entries(card)) {
    if (!main[type]) main[type] = {};

    for (const [name, schema] of Object.entries(components)) {
      // Only add if not exists
      if (!(name in main[type])) {
        main[type][name] = schema;
      }
    }
  }
}
```

### Last-Wins Strategy

```typescript
function mergeLastWins(
  main: ComponentsObject,
  card: ComponentsObject
): void {
  for (const [type, components] of Object.entries(card)) {
    if (!main[type]) main[type] = {};

    // Always replace
    Object.assign(main[type], components);
  }
}
```

## Schema Equality Check

### Deep Equality

```typescript
function areSchemasSame(a: unknown, b: unknown): boolean {
  // Handle primitives
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object" || a === null || b === null) return false;

  // Handle arrays
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== (b as unknown[]).length) return false;
    return a.every((item, i) => areSchemasSame(item, (b as unknown[])[i]));
  }

  // Handle objects
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;

  const aKeys = Object.keys(aObj).sort();
  const bKeys = Object.keys(bObj).sort();

  if (aKeys.length !== bKeys.length) return false;
  if (!aKeys.every((k, i) => k === bKeys[i])) return false;

  return aKeys.every(key => areSchemasSame(aObj[key], bObj[key]));
}
```

### Considerations

- Order of properties shouldn't matter
- Normalize refs before comparison
- Handle `$ref` pointing to same target

## Reference Updating

### Find and Replace

```typescript
function updateRefs(
  data: unknown,
  renames: Map<string, string>
): unknown {
  if (typeof data !== "object" || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => updateRefs(item, renames));
  }

  const obj = data as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === "$ref" && typeof value === "string") {
      result[key] = renames.get(value) ?? value;
    } else {
      result[key] = updateRefs(value, renames);
    }
  }

  return result;
}
```

## Component Types

ContractedAPI component types (derived from OpenAPI structure):

```typescript
type ComponentType =
  | "schemas"
  | "responses"
  | "parameters"
  | "examples"
  | "requestBodies"
  | "headers"
  | "securitySchemes"
  | "links"
  | "callbacks";
```

## Error Messages

Good conflict error:

```
Component merge conflicts:
  - schemas/User (from user-card): different definition
    Main: { type: "object", properties: { name: "string" } }
    Card: { type: "object", properties: { id: "integer", name: "string" } }
  - responses/NotFound (from error-card): different definition
```

## Testing Strategy

Test cases:
1. No components in card
2. New components (no conflict)
3. Same definition (no conflict)
4. Different definition (conflict)
5. Error strategy throws
6. Namespace strategy renames
7. First-wins keeps original
8. Last-wins replaces
9. Multiple cards with conflicts
10. Self-referencing schemas
11. Cross-card references after namespace
