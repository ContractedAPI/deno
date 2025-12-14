# Feature: base-client - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: base-client Implementation
    dateFormat  YYYY-MM-DD
    section Core
        HasUrl interface         :t1, 2025-01-01, 1d
        Client class             :t2, after t1, 2d
        URL composition          :t3, after t2, 1d
    section Testing
        Unit tests               :t4, after t3, 1d
```

## Task Checklist

- [ ] Define `HasUrl` interface with url and path
- [ ] Create `Client` class with dual constructors
- [ ] Implement URL composition getter
- [ ] Implement path tracking getter
- [ ] Handle trailing slash normalization
- [ ] Write unit tests

## Acceptance Criteria

- [ ] URL correctly resolved through chain
- [ ] Path segments properly joined
- [ ] Works with nested clients
