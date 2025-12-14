# Task: schema-compiler - Agent Prompt

> **Branch**: `openapi-transpiler/epic-server/feature-validation/task-schema-compiler/task`

## Implementation
```typescript
import Ajv, { type ErrorObject } from 'ajv';
import type { JSONSchema } from '../types/schema.ts';

const ajv = new Ajv({ allErrors: true, strict: false });

export interface ValidationResult {
  valid: boolean;
  errors: Array<{ path: string; message: string }>;
}

export function validate(data: unknown, schema: JSONSchema): ValidationResult {
  const valid = ajv.validate(schema, data);
  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors = (ajv.errors || []).map((e: ErrorObject) => ({
    path: e.instancePath || '/',
    message: e.message || 'Validation failed',
  }));

  return { valid: false, errors };
}
```

## Commit
`feat: add schema validation with AJV`
