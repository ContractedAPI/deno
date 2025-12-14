# Feature: http-methods

## Overview

Implement HTTP method helpers following the simple/complex pattern. Simple methods (GET, HEAD, DELETE) have no body; complex methods (POST, PUT, PATCH) include request bodies.

## Key Deliverables

- Simple method implementation (GET, HEAD, DELETE)
- Complex method implementation (POST, PUT, PATCH)
- Method overloads for flexible calling
- Response parsing (JSON/empty)
- Status code validation

## File Structure

```
src/client/
├── client.ts           # Method implementations
└── types.ts            # Method type
```

## Acceptance Criteria

- [ ] GET, HEAD, DELETE work without body
- [ ] POST, PUT, PATCH work with body
- [ ] Method overloads provide flexibility
- [ ] JSON responses parsed correctly
- [ ] Empty responses handled
