# Task: specification-type - Research

## Reference

See [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for field alias rationale.

## Field Aliases

ContractedAPI uses its own field names but accepts OpenAPI aliases:

| ContractedAPI | OpenAPI Alias | Purpose |
|---------------|---------------|---------|
| `contractedapi` | `openapi` | Version string |
| `spec` | `paths` | Route/contract definitions |
| `events` | `webhooks` | Fire-and-maybe-forget events |

The loader normalizes to ContractedAPI names internally.
