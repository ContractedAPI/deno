# Feature: glob-resolution

## Overview

Implement glob pattern resolution for ContractedAPI's `#./pattern` include syntax. This feature handles the expansion of glob patterns to file paths and the contextual import rules based on where the glob appears in the specification.

## Key Deliverables

- Glob pattern detection (`#./` prefix)
- Pattern expansion using `@std/fs/expandGlob`
- Context-aware path/method inheritance
- Circular include detection
- ContractCard loading and normalization

## File Structure

```
src/loader/
├── glob.ts             # Glob resolution logic
├── include.ts          # Include processing
└── types.ts            # GlobMatch, ContractCard types
```

## Dependencies

### External
- `@std/fs` - expandGlob for pattern matching
- `@std/path` - Path resolution utilities

### Internal
- feature-format-detection (parseFile)

## Dependents

- feature-ref-resolution (processes glob-loaded content)
- feature-component-merging (merges card components)

## Key Patterns

### Glob Syntax

```yaml
paths:
  # Root-level glob - uses card's defaults
  "#./cards/*.yaml": {}

  # Path-level glob - overrides path
  /users:
    "#./cards/user-*.yaml": {}

  # Method-level glob - overrides path and method
  /users:
    get:
      "#./cards/list-users.yaml": {}
```

### Import Location Rules

| Import Location | Path Source | Method Source |
|-----------------|-------------|---------------|
| Root `paths` | Card's default | Card's default |
| Under a path | Override from parent | Card's default |
| Under a method | Override from parent path | Override from parent method |

## Acceptance Criteria

- [ ] Detects `#./` prefixed patterns
- [ ] Expands glob patterns to file list
- [ ] Correctly inherits path from parent context
- [ ] Correctly inherits method from parent context
- [ ] Detects and reports circular includes
- [ ] Handles non-matching globs gracefully
