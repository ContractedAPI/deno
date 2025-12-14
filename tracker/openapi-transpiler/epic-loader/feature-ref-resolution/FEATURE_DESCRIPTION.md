# Feature: ref-resolution

## Overview

Implement `$ref` JSON pointer resolution for ContractedAPI specifications. This feature handles the dereferencing of JSON Schema references within loaded specifications, supporting both local (`#/components/...`) and preserving external references for downstream processing.

## Key Deliverables

- JSON pointer parsing (`#/path/to/component`)
- Local reference resolution within document
- Circular reference detection
- External reference preservation
- Deep recursive resolution in schemas

## File Structure

```
src/loader/
├── ref.ts              # $ref resolution logic
├── pointer.ts          # JSON pointer utilities
└── types.ts            # RefResolutionOptions
```

## Dependencies

### External
- None (uses native JSON operations)

### Internal
- feature-format-detection (parsed document structure)
- feature-glob-resolution (loaded cards with components)

## Dependents

- feature-component-merging (resolved refs for merging)
- epic-transpiler (fully dereferenced schemas)

## Key Patterns

### JSON Pointer Syntax

```
#/components/schemas/User
│ │          │       │
│ │          │       └── Schema name
│ │          └── Component type
│ └── Root components object
└── Current document marker
```

### Reference Types

| Pattern | Type | Action |
|---------|------|--------|
| `#/...` | Local | Resolve within document |
| `./file.yaml#/...` | External file | Preserve for later |
| `http://...` | Remote | Preserve for later |

## Acceptance Criteria

- [ ] Parses JSON pointers correctly
- [ ] Resolves local references within document
- [ ] Detects circular references
- [ ] Preserves external references unchanged
- [ ] Recursively resolves nested references
- [ ] Handles escaped characters in pointers
