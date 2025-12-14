# Task: schema-args - Agent Prompt

> **Branch**: `openapi-transpiler/epic-cli/feature-argument-parser/task-schema-args/task`

## Implementation
```typescript
import type { JSONSchema } from '../types/schema.ts';

export interface CliArg {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
  description?: string;
  default?: unknown;
}

export function schemaToArgs(schema: JSONSchema): CliArg[] {
  if (schema.type !== 'object' || !schema.properties) {
    return [];
  }

  const required = new Set(schema.required || []);
  return Object.entries(schema.properties).map(([name, prop]) => ({
    name,
    type: mapSchemaType(prop.type),
    required: required.has(name),
    description: prop.description,
    default: prop.default,
  }));
}

function mapSchemaType(type: string | undefined): CliArg['type'] {
  switch (type) {
    case 'integer':
    case 'number': return 'number';
    case 'boolean': return 'boolean';
    case 'array': return 'array';
    default: return 'string';
  }
}
```

## Commit
`feat: add schema-to-args mapper`
