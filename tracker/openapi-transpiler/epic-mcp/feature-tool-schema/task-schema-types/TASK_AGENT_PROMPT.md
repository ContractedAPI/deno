# Task: schema-types - Agent Prompt

> **Branch**: `openapi-transpiler/epic-mcp/feature-tool-schema/task-schema-types/task`

## Implementation
```typescript
export interface ToolSchema {
  type: 'object';
  properties: Record<string, unknown>;
  required?: string[];
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: ToolSchema;
}
```

## Commit
`feat: add MCP tool schema types`
