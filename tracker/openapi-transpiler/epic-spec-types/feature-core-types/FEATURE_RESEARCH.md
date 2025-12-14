# Feature: core-types - Research

## ContractedAPI vs OpenAPI

See [EPIC_RESEARCH.md](../EPIC_RESEARCH.md) for comprehensive type definitions.

## Key Differentiators

### Multiple Contracts per Method

OpenAPI: one operation per path+method
ContractedAPI: multiple named contracts per path+method

```yaml
/users:
  post:
    user:create:          # Contract 1
      request: { ... }
    user:create:admin:    # Contract 2
      request: { ... }
```

### Field Aliases

| ContractedAPI | OpenAPI Alias | Purpose |
|---------------|---------------|---------|
| `contractedapi` | `openapi` | Version |
| `spec` | `paths` | Routes |
| `events` | `webhooks` | Events |

### ContractCardPath

Glob import pattern: `#./pattern/*.yaml`

```typescript
export type ContractCardPath = `#${string}`;

export function isContractCardPath(value: string): value is ContractCardPath {
  return value.startsWith('#');
}
```
