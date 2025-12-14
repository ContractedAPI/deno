# Task: serialization - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-openapi-emitter/task-serialization/task`

## Implementation
```typescript
import { stringify as yamlStringify } from 'yaml';

export function serializeYAML(doc: object): string {
  return yamlStringify(doc, { indent: 2 });
}

export function serializeJSON(doc: object): string {
  return JSON.stringify(doc, null, 2);
}

export function emit(spec: Specification, options: OpenAPIEmitterOptions): string {
  const doc = emitDocument(spec, options);
  return options.format === 'yaml' ? serializeYAML(doc) : serializeJSON(doc);
}
```

## Commit
`feat: add OpenAPI serialization functions`
