# Task: contract-types - Checklist

## Implementation Checklist

- [ ] Define `Contract` type (request?, response?, ws?, error?, description?, tags?, deprecated?)
- [ ] Define `ContractCard` type (extends Contract + path, method, name, components?)
- [ ] Define `ContractCardPath` template literal type (`#${string}`)
- [ ] Implement `isContractCardPath` type guard function
- [ ] Add JSDoc comments with examples

## Acceptance Criteria

- [ ] Contract has minimal required fields
- [ ] ContractCard includes path/method/name
- [ ] Type guard correctly identifies glob patterns
