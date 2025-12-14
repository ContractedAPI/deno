# Feature: error-handling - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: error-handling Implementation
    dateFormat  YYYY-MM-DD
    section Core
        CodedError class         :t1, 2025-01-01, 1d
        Error formatting         :t2, after t1, 2d
        Status mapping           :t3, after t2, 1d
    section Integration
        Middleware integration   :t4, after t3, 1d
        Stack trace handling     :t5, after t4, 1d
    section Testing
        Unit tests               :t6, after t5, 1d
```

## Task Checklist

- [ ] Create `CodedError` class with message and status
- [ ] Create error code constants (400, 404, 500, etc.)
- [ ] Implement `formatError(error: unknown): ErrorResponse`
- [ ] Implement `errorToResponse(error: unknown): Response`
- [ ] Handle validation errors specially
- [ ] Configure stack trace visibility by environment
- [ ] Write unit tests

## Acceptance Criteria

- [ ] All errors have consistent shape
- [ ] Status codes correctly mapped
- [ ] Validation errors include details
- [ ] Production hides stack traces
