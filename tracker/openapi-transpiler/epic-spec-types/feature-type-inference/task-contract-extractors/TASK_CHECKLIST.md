# Task: contract-extractors - Checklist

## Implementation Checklist

- [ ] Create `src/schema/inference.ts`
- [ ] Define `ContractRequest<C>` type helper
- [ ] Define `ContractResponse<C>` type helper
- [ ] Define `ContractError<C>` type helper
- [ ] Handle contracts without request/response
- [ ] Add JSDoc with examples

## Acceptance Criteria

- [ ] Correctly extracts types from contract schemas
- [ ] Returns `never` or `undefined` for missing schemas
- [ ] Works with FromSchema-inferred types
