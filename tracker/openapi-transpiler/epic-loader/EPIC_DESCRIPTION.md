# Epic: loader

## Overview

Implement the loading and resolution system for ContractedAPI specifications. The loader is responsible for:
1. Parsing spec files from multiple formats (YAML, JSON, TOML)
2. Resolving glob patterns (`#./pattern/*.yaml`) for ContractCard imports
3. Resolving `$ref` references to components
4. Merging local components from ContractCards into the main spec
5. Normalizing the loaded specification into a consistent internal format

This is a critical foundational epic - all downstream epics (transpiler, server, client, cli, mcp) depend on the loader producing correctly resolved contracts.

## Key Deliverables

### feature-format-detection
- Multi-format support: YAML (.yaml, .yml), JSON (.json), TOML (.toml)
- Format auto-detection from file extension
- Consistent parsing API across formats

### feature-glob-resolution
- Glob pattern syntax: `#./pattern/*.yaml`
- ContractCard import resolution with path/method override rules
- Document-order merging when multiple cards resolve to same path.method

### feature-ref-resolution
- OpenAPI-style `$ref` pointer resolution
- Support for local references (`#/components/schemas/User`)
- Circular reference detection with clear error messages

### feature-component-merging
- Merge ContractCard local `components` into main spec
- Conflict detection and resolution strategy
- Namespace isolation options

### feature-validation
- Schema validation for loaded specs
- Contract validation (required fields, valid methods, etc.)
- Helpful error messages with file/line context

## File Structure

```
src/loader/
├── mod.ts              # Public exports
├── loader.ts           # Main orchestrator
├── format.ts           # Format detection and parsing
├── glob.ts             # Glob pattern resolution
├── refs.ts             # $ref resolution
├── components.ts       # Component merging
└── validate.ts         # Validation utilities
```

## Dependencies

### External
- `@std/yaml` - YAML parsing
- `@std/toml` - TOML parsing (optional)
- `@std/path` - Path manipulation
- `@std/fs` - Glob expansion (or third-party)

### Internal
- **epic-spec-types** (must be complete)
  - `Specification`, `Contract`, `ContractCard` types
  - `ContractCardPath` type guard
  - JSON Schema types

## Dependents

All downstream epics require loaded contracts:
- **epic-transpiler** - Needs resolved contracts to generate TypeScript/OpenAPI
- **epic-server** - Needs resolved contracts to build routes
- **epic-client** - Needs resolved contracts for typed client generation
- **epic-cli** - Needs resolved contracts for command generation
- **epic-mcp** - Needs resolved contracts for tool generation

## Key Differences from Reference

| Aspect | Reference (`loader.ts`) | New Loader |
|--------|-------------------------|------------|
| Import syntax | `$include` directive | `#./glob/pattern` syntax |
| Import scope | Array flattening only | Path/method override rules |
| Components | Not supported | Full `$ref` + merging |
| Validation | Basic field checks | Schema-based validation |
| Output | `EndpointContract[]` | `ResolvedSpecification` with metadata |
