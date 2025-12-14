# Feature: contract-factory - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: contract-factory Implementation
    dateFormat  YYYY-MM-DD
    section Core
        Create function          :t1, 2025-01-01, 2d
        Method dispatch          :t2, after t1, 1d
        Parameter encoding       :t3, after t2, 1d
    section Testing
        Unit tests               :t4, after t3, 1d
```

## Task Checklist

- [ ] Implement `create<TReq, TRes>(contract, client)` factory
- [ ] Dispatch to simple/complex based on method
- [ ] Implement query parameter encoding for GET
- [ ] Implement path parameter interpolation
- [ ] Return typed function `(request?: TReq) => Promise<TRes>`
- [ ] Write unit tests
