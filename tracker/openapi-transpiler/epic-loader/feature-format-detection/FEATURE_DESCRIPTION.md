# Feature: format-detection

## Overview

Implement file format detection and multi-format parsing for ContractedAPI specification files. This feature supports YAML, JSON, and TOML formats based on file extension detection.

## Key Deliverables

- File extension detection function
- YAML parser integration (@std/yaml)
- JSON parser (native)
- TOML parser integration (@std/toml)
- Unified parse function with format auto-detection
- Error handling for unsupported formats

## File Structure

```
src/loader/
├── format.ts           # Format detection and parsing
└── types.ts            # Format type definitions
```

## Dependencies

### External
- `@std/yaml` - YAML parsing
- `@std/toml` - TOML parsing

### Internal
- None (foundational feature)

## Dependents

- feature-glob-resolution (uses parseFile)
- feature-ref-resolution (uses parsed output)
- feature-component-merging (uses parsed output)

## Key Patterns

### Format Type

```typescript
type Format = "json" | "yaml" | "toml";
```

### Extension Mapping

| Extension | Format |
|-----------|--------|
| `.json` | json |
| `.yaml` | yaml |
| `.yml` | yaml |
| `.toml` | toml |

## Acceptance Criteria

- [ ] Correctly identifies format from file extension
- [ ] Parses YAML files without error
- [ ] Parses JSON files without error
- [ ] Parses TOML files without error
- [ ] Throws descriptive error for unknown extensions
- [ ] Handles empty files gracefully
