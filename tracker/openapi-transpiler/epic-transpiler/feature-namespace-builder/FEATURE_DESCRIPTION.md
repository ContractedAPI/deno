# Feature: namespace-builder

## Overview

Implement namespace derivation and organization from ContractedAPI specifications. This feature transforms URL paths into TypeScript namespace hierarchies that group related contracts together.

## Key Deliverables

- Path-to-namespace conversion logic
- Namespace tree construction
- Contract grouping by namespace
- PascalCase naming for namespaces
- Path parameter handling options

## File Structure

```
src/transpiler/
├── namespace.ts        # Namespace derivation logic
├── tree.ts             # Namespace tree structure
└── types.ts            # NamespaceNode, NamespaceTree types
```

## Dependencies

### External
- None

### Internal
- epic-loader (loaded specification with contracts)

## Dependents

- feature-typescript-emitter (uses namespace structure)
- feature-openapi-emitter (uses namespace for tagging)

## Key Patterns

### Path to Namespace Conversion

```
Path: /api/users        → Namespace: Api.Users
Path: /api/users/{id}   → Namespace: Api.Users (or Api.Users.Id)
Path: /auth/login       → Namespace: Auth
Path: /                 → Namespace: Root
```

### Conversion Rules

1. Split path on `/`
2. Filter empty segments
3. PascalCase each segment
4. Handle path parameters (`{id}` → `Id` or flatten)
5. Join with `.` for nested namespaces

### Contract Grouping

Contracts are grouped by their derived namespace:
- All `/api/users` contracts → `Api.Users` namespace
- All `/auth` contracts → `Auth` namespace

## Acceptance Criteria

- [ ] Correctly converts paths to namespaces
- [ ] Groups contracts by namespace
- [ ] Handles path parameters consistently
- [ ] Produces valid TypeScript namespace names
- [ ] Handles edge cases (root path, deep nesting)
