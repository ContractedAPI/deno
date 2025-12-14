# Task: path-conversion - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-namespace-builder/task-path-conversion/task`

## Implementation
```typescript
export function pathToSegments(path: string): string[] {
  return path.split('/').filter(s => s.length > 0);
}

export function segmentToNamespace(segment: string): string {
  // Handle {param} -> Param
  const cleaned = segment.replace(/^\{(.+)\}$/, '$1');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function pathToNamespace(path: string): string {
  return pathToSegments(path).map(segmentToNamespace).join('.');
}
```

## Commit
`feat: add path-to-namespace conversion functions`
