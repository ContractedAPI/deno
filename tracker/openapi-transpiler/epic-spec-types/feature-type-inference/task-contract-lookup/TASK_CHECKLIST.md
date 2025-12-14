# Task: contract-lookup - Checklist

## Implementation Checklist

- [ ] Create `src/schema/lookup.ts`
- [ ] Define `ContractByName<Contracts, Name>` using Extract
- [ ] Define `ContractNames<Contracts>` to get name union
- [ ] Add JSDoc with examples

## Acceptance Criteria

- [ ] Correctly finds contract by name
- [ ] Works with readonly arrays
- [ ] Returns `never` for unknown names
