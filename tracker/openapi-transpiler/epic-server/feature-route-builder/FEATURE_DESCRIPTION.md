# Feature: route-builder

## Overview

Implement the RouteBuilder tree pattern for organizing HTTP routes. The RouteBuilder extends Map to create a hierarchical structure matching URL paths, enabling efficient route matching and handler dispatch.

## Key Deliverables

- RouteBuilder class extending Map
- Path segment parsing and tree construction
- Route registration API
- Path parameter extraction
- Route matching algorithm

## File Structure

```
src/server/
├── route-builder.ts    # RouteBuilder class
├── path.ts             # Path parsing utilities
└── types.ts            # RouteNode, RouteHandler types
```

## Dependencies

### External
- None

### Internal
- epic-spec-types (contract definitions)

## Dependents

- feature-validation (validates matched routes)
- feature-error-handling (route not found errors)

## Acceptance Criteria

- [ ] RouteBuilder extends Map correctly
- [ ] Path segments parsed properly
- [ ] Routes registered and retrievable
- [ ] Path parameters extracted
- [ ] Route matching works for all patterns
