# Task: url-builder - Agent Prompt

> **Branch**: `openapi-transpiler/epic-client/feature-base-client/task-url-builder/task`

## Implementation
```typescript
export function joinPath(...segments: string[]): string {
  return segments
    .map(s => s.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
}

export function normalizeUrl(base: string, path: string): string {
  const baseUrl = base.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
}
```

## Commit
`feat: add URL building utilities`
