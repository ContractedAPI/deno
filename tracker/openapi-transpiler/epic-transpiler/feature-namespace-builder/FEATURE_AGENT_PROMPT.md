# Feature: namespace-builder - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicTranspiler.FeatureNamespaceBuilder`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-transpiler/feature-namespace-builder/feature`

## Context

You are implementing namespace derivation from URL paths for ContractedAPI. Namespaces organize generated TypeScript code into logical groupings based on API structure.

## Your Role

Implement the namespace builder:
1. Convert URL paths to namespace strings
2. Build namespace tree from contracts
3. Group contracts by namespace
4. Handle path parameters appropriately

## Prerequisites

- epic-loader (must be complete)

## File Structure Target

```
src/transpiler/
├── namespace.ts        # Namespace derivation logic
├── tree.ts             # Namespace tree structure
└── types.ts            # NamespaceNode, NamespaceTree types
```

## Implementation Guide

### Types

```typescript
export interface NamespaceNode {
  name: string;                           // PascalCase name
  fullPath: string;                       // Dot-separated path (e.g., "Api.Users")
  children: Map<string, NamespaceNode>;   // Child namespaces
  contracts: Contract[];                  // Contracts at this level
}

export interface NamespaceTree {
  roots: Map<string, NamespaceNode>;      // Top-level namespaces
}

export interface NamespaceOptions {
  pathParamStrategy: "flatten" | "include";  // How to handle {id}
  rootName: string;                          // Name for / path (default: "Root")
}
```

### Path Parsing

```typescript
export function pathToSegments(path: string): string[] {
  return path
    .split("/")
    .filter(Boolean);  // Remove empty strings
}

// Example: "/api/users/{id}" → ["api", "users", "{id}"]
```

### Namespace Conversion

```typescript
export function segmentToNamespace(segment: string): string {
  // Handle path parameters
  if (segment.startsWith("{") && segment.endsWith("}")) {
    const param = segment.slice(1, -1);
    return toPascalCase(param);  // {userId} → UserId
  }

  return toPascalCase(segment);  // users → Users
}

export function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

export function pathToNamespace(path: string, options?: NamespaceOptions): string {
  const segments = pathToSegments(path);

  if (segments.length === 0) {
    return options?.rootName ?? "Root";
  }

  return segments
    .map(segmentToNamespace)
    .join(".");
}
```

### Tree Building

```typescript
export function buildNamespaceTree(
  contracts: Contract[],
  options?: NamespaceOptions
): NamespaceTree {
  const tree: NamespaceTree = { roots: new Map() };

  for (const contract of contracts) {
    const namespace = pathToNamespace(contract.path, options);
    addContractToTree(tree, namespace, contract);
  }

  return tree;
}

function addContractToTree(
  tree: NamespaceTree,
  namespace: string,
  contract: Contract
): void {
  const parts = namespace.split(".");
  let current: Map<string, NamespaceNode> = tree.roots;
  let fullPath = "";

  for (const part of parts) {
    fullPath = fullPath ? `${fullPath}.${part}` : part;

    if (!current.has(part)) {
      current.set(part, {
        name: part,
        fullPath,
        children: new Map(),
        contracts: [],
      });
    }

    const node = current.get(part)!;
    current = node.children;

    // Add contract to final node
    if (fullPath === namespace) {
      node.contracts.push(contract);
    }
  }
}
```

### Tree Traversal

```typescript
export function* walkNamespaces(tree: NamespaceTree): Iterable<NamespaceNode> {
  function* walkNode(node: NamespaceNode): Iterable<NamespaceNode> {
    yield node;
    for (const child of node.children.values()) {
      yield* walkNode(child);
    }
  }

  for (const root of tree.roots.values()) {
    yield* walkNode(root);
  }
}
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Check the checklist** - Refer to [FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)
4. **Valid identifiers** - Ensure namespace names are valid TypeScript
5. **Handle edge cases** - Root path, deep nesting, path params
