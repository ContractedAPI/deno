# Feature: component-merging

## Overview

Implement component merging for ContractedAPI specifications. When ContractCards define local `components`, they must be merged into the main specification's components object, handling conflicts according to configurable strategies.

## Key Deliverables

- Component extraction from ContractCards
- Conflict detection between cards and main spec
- Merge strategy implementation (error, namespace, first-wins, last-wins)
- Reference updating when namespacing
- Final merged specification output

## File Structure

```
src/loader/
├── merge.ts            # Component merging logic
├── conflict.ts         # Conflict detection
└── types.ts            # MergeStrategy, MergeOptions
```

## Dependencies

### External
- None

### Internal
- feature-format-detection (parsed document structure)
- feature-glob-resolution (loaded cards with components)
- feature-ref-resolution (resolved references)

## Dependents

- epic-transpiler (uses fully merged specification)
- epic-server (uses merged schemas for validation)

## Key Patterns

### Merge Strategies

| Strategy | Behavior on Conflict |
|----------|---------------------|
| `error` | Throw error with conflict details |
| `namespace` | Prefix conflicting name with card name |
| `first-wins` | Keep existing, ignore new |
| `last-wins` | Replace existing with new |

### Component Types

ContractedAPI components (derived from OpenAPI structure):
- `schemas` - JSON Schema definitions
- `responses` - Response definitions
- `parameters` - Parameter definitions
- `requestBodies` - Request body definitions
- `headers` - Header definitions
- `securitySchemes` - Security definitions

## Acceptance Criteria

- [ ] Extracts components from all loaded cards
- [ ] Detects conflicts correctly
- [ ] Implements all four merge strategies
- [ ] Namespace strategy updates internal refs
- [ ] Produces valid merged specification
- [ ] Reports conflicts with clear details
