# Feature: glob-resolution - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: glob-resolution Implementation
    dateFormat  YYYY-MM-DD
    section Core
        Glob detection           :t1, 2025-01-01, 1d
        Pattern expansion        :t2, after t1, 2d
        Context tracking         :t3, after t2, 1d
        Circular detection       :t4, after t3, 1d
    section Integration
        ContractCard loading     :t5, after t4, 2d
        Path/method inheritance  :t6, after t5, 1d
    section Testing
        Unit tests               :t7, after t6, 1d
```

## Task Checklist

- [ ] Define `GlobMatch` type for pattern results
- [ ] Create `isGlobPattern(key: string): boolean`
  - Check for `#./` prefix
  - Validate pattern syntax
- [ ] Create `expandGlobPattern(pattern: string, baseDir: string): AsyncIterable<string>`
  - Strip `#./` prefix
  - Resolve relative to base directory
  - Use `@std/fs/expandGlob`
- [ ] Create `ImportContext` type
  - Track current path override
  - Track current method override
  - Track visited files for circular detection
- [ ] Create `processGlobImport(pattern: string, context: ImportContext): Promise<ContractCard[]>`
  - Expand pattern to files
  - Load each file
  - Apply context overrides
- [ ] Implement circular include detection
  - Track visited file paths (normalized)
  - Throw descriptive error on cycle
- [ ] Implement path inheritance logic
  - Root level: use card's path
  - Under path: override card's path
  - Under method: override both
- [ ] Create `normalizeContractCard(card: unknown, context: ImportContext): ContractCard`
  - Validate card structure
  - Apply path/method overrides
  - Preserve components
- [ ] Handle edge cases
  - Non-matching glob (empty result)
  - Invalid card structure
  - Missing required fields
- [ ] Write unit tests

## Acceptance Criteria

- [ ] All glob patterns correctly expanded
- [ ] Context inheritance works at all levels
- [ ] Circular includes detected before infinite loop
- [ ] Error messages include pattern and context
