# Task: resource-types - Agent Prompt

> **Branch**: `openapi-transpiler/epic-mcp/feature-resource-provider/task-resource-types/task`

## Implementation
```typescript
export interface McpResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ResourceContent {
  uri: string;
  mimeType: string;
  text: string;
}
```

## Commit
`feat: add MCP resource types`
