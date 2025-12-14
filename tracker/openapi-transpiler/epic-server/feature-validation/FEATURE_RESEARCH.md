# Feature: validation - Research

## AJV Configuration

```typescript
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({
  allErrors: true,      // Collect all errors, not just first
  coerceTypes: false,   // Don't auto-coerce types
  useDefaults: true,    // Apply default values
});

addFormats(ajv);  // Add format validators (email, uri, etc.)
```

## Schema-Based Dispatch

From epic-server EPIC_RESEARCH.md:

When multiple contracts share the same path+method, select based on request schema match:

```typescript
export function dispatch(
  body: unknown,
  contracts: Contract[]
): Contract | null {
  for (const contract of contracts) {
    if (!contract.request) continue;

    const validate = ajv.compile(contract.request);
    if (validate(body)) {
      return contract;
    }
  }
  return null;
}
```

## Validation Error Format

```typescript
interface ValidationError {
  path: string;       // "/name" or "/items/0/id"
  message: string;    // "must be string"
  keyword: string;    // "type", "required", etc.
  value?: unknown;    // Actual value that failed
}
```

## Testing Strategy

- Valid data passes
- Invalid type rejected
- Missing required rejected
- Multiple errors collected
- Schema dispatch selects correctly
