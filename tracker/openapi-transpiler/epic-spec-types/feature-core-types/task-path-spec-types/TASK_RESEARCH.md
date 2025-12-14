# Task: path-spec-types - Research

## Reference

See [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for spec structure details.

## Hierarchy

```
Specification
└── spec (SpecObject)
    └── "/path" (PathItemObject)
        └── get/post/etc (MethodObject)
            └── "contract:name" (Contract)
```

## Glob Import Locations

ContractCardPath can appear at multiple levels:
1. In `spec` as a path key
2. As a `PathItemObject` value
3. As a `MethodObject` value

Each level affects how the card's path/method defaults are used.
