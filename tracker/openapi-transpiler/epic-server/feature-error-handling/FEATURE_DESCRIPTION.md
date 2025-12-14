# Feature: error-handling

## Overview

Implement structured error handling for ContractedAPI servers. This feature provides typed error responses, error code mapping, and consistent error formatting.

## Key Deliverables

- CodedError class with status codes
- Error response formatting
- HTTP status code mapping
- Error middleware integration
- Stack trace handling (dev vs prod)

## File Structure

```
src/server/
├── errors.ts           # Error classes
├── codes.ts            # Error code definitions
├── format.ts           # Error response formatting
└── types.ts            # ErrorResponse types
```

## Dependencies

### External
- None

### Internal
- feature-validation (validation errors)

## Dependents

- epic-cli (error display)
- epic-mcp (error formatting)

## Acceptance Criteria

- [ ] CodedError carries status code
- [ ] Errors formatted as JSON
- [ ] Stack traces hidden in production
- [ ] Validation errors include field details
- [ ] Consistent error response shape
