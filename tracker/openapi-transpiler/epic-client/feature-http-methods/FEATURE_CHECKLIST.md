# Feature: http-methods - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: http-methods Implementation
    dateFormat  YYYY-MM-DD
    section Core
        Simple methods           :t1, 2025-01-01, 2d
        Complex methods          :t2, after t1, 2d
        Method overloads         :t3, after t2, 1d
    section Testing
        Unit tests               :t4, after t3, 1d
```

## Task Checklist

- [ ] Implement `simple(method, path?, specificCode?)`
- [ ] Implement `complex(method, pathOrBody?, body?, specificCode?)`
- [ ] Implement `get(path?, specificCode?)`
- [ ] Implement `head(path?, specificCode?)`
- [ ] Implement `delete(path?, specificCode?)`
- [ ] Implement `post(pathOrBody?, body?)` with overloads
- [ ] Implement `put(pathOrBody?, body?)` with overloads
- [ ] Implement `patch(pathOrBody?, body?)` with overloads
- [ ] Handle JSON parsing and empty responses
- [ ] Write unit tests
