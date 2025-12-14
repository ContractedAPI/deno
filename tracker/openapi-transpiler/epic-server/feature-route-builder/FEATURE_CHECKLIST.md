# Feature: route-builder - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: route-builder Implementation
    dateFormat  YYYY-MM-DD
    section Core
        RouteBuilder class       :t1, 2025-01-01, 2d
        Path parsing             :t2, after t1, 1d
        Tree construction        :t3, after t2, 2d
    section Matching
        Route matching           :t4, after t3, 2d
        Parameter extraction     :t5, after t4, 1d
    section Testing
        Unit tests               :t6, after t5, 1d
```

## Task Checklist

- [ ] Define `RouteNode` interface
- [ ] Create `RouteBuilder extends Map<string, RouteBuilder>`
- [ ] Implement path segment parsing
- [ ] Implement `add(path: string, handler: RouteHandler)`
- [ ] Implement `match(path: string): MatchResult`
- [ ] Implement path parameter extraction
- [ ] Handle static vs dynamic segments
- [ ] Write unit tests

## Acceptance Criteria

- [ ] Routes correctly organized in tree
- [ ] Matching returns correct handler
- [ ] Parameters extracted from path
- [ ] Edge cases handled (root, trailing slash)
