# Feature: type-inference

## Overview

Implement type inference helpers for extracting typed request/response data from contracts and contract lookup utilities.

## Key Deliverables

- `ContractRequest<C>` - Extract request type from a Contract
- `ContractResponse<C>` - Extract response type from a Contract
- `ContractError<C>` - Extract error type from a Contract
- `ContractByName<Contracts, Name>` - Look up contract by name
- Contract binding and registry helpers

## Files

- `src/schema/inference.ts` - Type inference helpers
- `src/schema/lookup.ts` - Contract lookup utilities

## Dependencies

- **External**: None
- **Internal**:
  - feature-schema-types (FromSchema type)
  - feature-openapi-types (RequestBodyObject, ResponseObject types)
  - feature-core-types (Contract type)
