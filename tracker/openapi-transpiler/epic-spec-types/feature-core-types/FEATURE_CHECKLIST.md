# Feature: core-types - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: core-types Implementation
    dateFormat  YYYY-MM-DD
    section Tasks
        Specification type       :st, 2025-01-01, 1d
        Contract types           :ct, after st, 1d
        Path/Spec object types   :ps, after ct, 1d
        Events types             :et, after ps, 1d
```

## Task Checklist

> **Note**: Tasks will be defined when this feature is commenced.

- [x] Implement Specification type with field aliases
- [x] Implement Contract type
- [x] Implement ContractCard type
- [x] Implement ContractCardPath with type guard
- [ ] Implement SpecObject and PathItemObject
- [ ] Implement ContractCollection type
- [ ] Implement EventsObject and EventDefinition
- [ ] Create mod.ts with public exports
- [ ] Add JSDoc documentation

## Acceptance Criteria

- [ ] All types compile under `strict: true`
- [ ] Field aliases correctly typed (both names work)
- [ ] `isContractCardPath` correctly identifies glob patterns
- [ ] All ContractedAPI-specific types present
- [ ] JSDoc comments on all public types
