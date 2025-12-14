# Feature: validation - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicServer.FeatureValidation`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-server/feature-validation/feature`

## Context

You are implementing JSON Schema validation for ContractedAPI server requests. This includes AJV integration and schema-based contract dispatch.

## Key Implementation

```typescript
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

export function validate(data: unknown, schema: JSONSchema): ValidationResult {
  const valid = ajv.validate(schema, data);
  return {
    valid,
    errors: ajv.errors ?? [],
  };
}

export function findMatchingContract(
  body: unknown,
  contracts: Contract[]
): Contract | null {
  for (const contract of contracts) {
    if (contract.request && validate(body, contract.request).valid) {
      return contract;
    }
  }
  return null;
}
```

## Commit Guidelines

- Conventional commit style, micro-commits (~20 lines)

## Important Reminders

1. Stay in your worktree
2. Check the checklist in FEATURE_CHECKLIST.md
