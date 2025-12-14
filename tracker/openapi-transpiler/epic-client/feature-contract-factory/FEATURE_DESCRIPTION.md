# Feature: contract-factory

## Overview

Implement the contract-to-client factory that creates typed HTTP call functions from contract definitions. The factory maps contracts to typed request/response functions.

## Key Deliverables

- `create()` factory function
- Contract to method mapping
- Path parameter handling
- Query parameter encoding for GET
- Type-safe return types

## File Structure

```
src/client/
├── factory.ts          # Create function
├── params.ts           # Parameter encoding
└── types.ts            # Factory types
```

## Acceptance Criteria

- [ ] Factory creates typed functions
- [ ] GET requests use query params
- [ ] POST/PUT/PATCH use body
- [ ] Path parameters interpolated
- [ ] Types flow correctly
