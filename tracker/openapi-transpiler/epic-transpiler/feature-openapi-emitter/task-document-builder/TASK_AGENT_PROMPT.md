# Task: document-builder - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-openapi-emitter/task-document-builder/task`

## Implementation
```typescript
export interface OpenAPIEmitterOptions {
  format: 'yaml' | 'json';
  openApiVersion: '3.0.3' | '3.1.0';
  title: string;
  version: string;
  description?: string;
  servers?: Array<{ url: string; description?: string }>;
}

export function emitInfo(options: OpenAPIEmitterOptions): object {
  return {
    title: options.title,
    version: options.version,
    ...(options.description && { description: options.description }),
  };
}

export function emitDocument(spec: Specification, options: OpenAPIEmitterOptions): object {
  return {
    openapi: options.openApiVersion,
    info: emitInfo(options),
    servers: options.servers || [],
    paths: emitPaths(spec.contracts),
  };
}
```

## Commit
`feat: add OpenAPI document builder`
