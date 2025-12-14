# Feature: validation - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: validation Implementation
    dateFormat  YYYY-MM-DD
    section Core
        AJV setup                :t1, 2025-01-01, 1d
        Request validation       :t2, after t1, 2d
        Schema dispatch          :t3, after t2, 2d
    section Integration
        Error formatting         :t4, after t3, 1d
        Response validation      :t5, after t4, 1d
    section Testing
        Unit tests               :t6, after t5, 1d
```

## Task Checklist

- [ ] Configure AJV with appropriate options
- [ ] Create `validate(data: unknown, schema: JSONSchema): ValidationResult`
- [ ] Create `findMatchingContract(body: unknown, contracts: Contract[]): Contract | null`
- [ ] Implement schema-based dispatch for multiple contracts
- [ ] Format validation errors with path and message
- [ ] Optional: Validate response before sending
- [ ] Write unit tests

## Acceptance Criteria

- [ ] Valid requests pass through
- [ ] Invalid requests rejected with details
- [ ] Correct contract selected via schema dispatch
- [ ] Error messages are user-friendly
