# Task: events-module - Research

## Reference

See [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for event semantics.

## Fire-and-Maybe-Forget

ContractedAPI events differ from OpenAPI webhooks:
- Response is optional
- No guaranteed delivery
- Suitable for notifications, logs, analytics

## Module Organization

Deno convention: `mod.ts` as entry point.

Export organization:
1. Core types (Specification, Contract, etc.)
2. OpenAPI types (for output generation)
3. Utility functions (type guards)
