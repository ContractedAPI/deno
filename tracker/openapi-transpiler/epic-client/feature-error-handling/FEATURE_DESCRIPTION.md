# Feature: error-handling (client)

## Overview

Implement client-side error handling with ResponseError class for HTTP errors. This provides typed error responses and status code access.

## Key Deliverables

- ResponseError class
- Status code capture
- Error message formatting
- Alive check pattern (boolean health check)

## File Structure

```
src/client/
├── errors.ts           # ResponseError class
└── types.ts            # Error types
```

## Acceptance Criteria

- [ ] ResponseError captures status and message
- [ ] Non-OK responses throw ResponseError
- [ ] Alive check returns boolean
- [ ] Error messages are useful
