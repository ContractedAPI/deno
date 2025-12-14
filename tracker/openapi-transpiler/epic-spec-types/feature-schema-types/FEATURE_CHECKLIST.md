# Feature: schema-types - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: schema-types Implementation
    dateFormat  YYYY-MM-DD
    section Tasks
        JSON serializable types  :jt, 2025-01-01, 1d
        FromSchema wrapper       :fs, after jt, 1d
        Module exports           :me, after fs, 1d
```

## Task Checklist

> **Note**: Tasks will be defined when this feature is commenced.

- [x] Implement JSON serializable types
- [ ] Implement FromSchema wrapper with `& JSONObject` correction
- [ ] Create mod.ts with public exports
- [ ] Add JSDoc documentation

## Acceptance Criteria

- [ ] All types compile under `strict: true`
- [ ] `FromSchema` correctly infers types from `as const` schemas
- [ ] `JSONObject` intersection applied to object types
- [ ] Re-exports organized in `mod.ts`
- [ ] JSDoc comments on all public types
