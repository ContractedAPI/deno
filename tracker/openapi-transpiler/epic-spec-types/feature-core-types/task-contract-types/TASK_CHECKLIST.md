# Task: contract-types - Checklist

## Implementation Checklist

- [x] Define `Contract` type (request?, response?, ws?, error?, description?, tags?, deprecated?)
- [x] Define `ContractCard` type (extends Contract + path, method, name, components?)
- [x] Define `ContractCardPath` template literal type (`#${string}`)
- [x] Implement `isContractCardPath` type guard function
- [x] Add JSDoc comments with examples

## Acceptance Criteria

- [x] Contract has minimal required fields
- [x] ContractCard includes path/method/name
- [x] Type guard correctly identifies glob patterns
