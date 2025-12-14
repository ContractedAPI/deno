# Feature: base-client

## Overview

Implement the base Client class with hierarchical URL composition. The Client supports both direct URL construction and parent-child relationships for building nested API paths.

## Key Deliverables

- Client class with URL composition
- HasUrl interface for composition
- Parent-child client nesting
- URL getter with lazy resolution
- Path tracking for debugging

## File Structure

```
src/client/
├── client.ts           # Client class
├── types.ts            # HasUrl interface
└── mod.ts              # Public exports
```

## Acceptance Criteria

- [ ] Client constructed with URL string
- [ ] Client constructed with parent + path
- [ ] URL correctly composed from hierarchy
- [ ] Path tracking works through chain
