# Task: path-spec-types - Checklist

## Implementation Checklist

- [ ] Define `ContractCollection` type (Record<string, Contract>)
- [ ] Define `MethodObject` type (ContractCollection or glob pattern)
- [ ] Define `PathItemObject` type (methods + parameters)
- [ ] Define `SpecObject` type (paths or glob patterns)
- [ ] Add JSDoc comments

## Acceptance Criteria

- [ ] Supports inline contracts
- [ ] Supports glob pattern imports
- [ ] Path parameters handled
