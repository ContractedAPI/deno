# Task: contract-types - Research

## Reference

See [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for contract semantics.

## Contract vs ContractCard

- **Contract**: Inline definition under `path.method.name`
- **ContractCard**: External file with default path/method/name

## ContractCardPath

Glob pattern syntax: `#./path/to/*.yaml`
- Starts with `#`
- Supports glob wildcards: `*`, `**`, `?`
- Relative to spec file location

## Multiple Contracts per Method

ContractedAPI allows multiple contracts under the same path.method:
```yaml
/users:
  post:
    user:create:        # First contract
      request: ...
    user:create:admin:  # Second contract (stricter)
      request: ...
```
