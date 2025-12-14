# Task: ws-upgrade - Agent Prompt

> **Branch**: `openapi-transpiler/epic-server/feature-websocket/task-ws-upgrade/task`

## Implementation
```typescript
export function isWebSocketUpgrade(req: Request): boolean {
  const upgrade = req.headers.get('upgrade');
  return upgrade?.toLowerCase() === 'websocket';
}

export function upgradeWebSocket(req: Request): { socket: WebSocket; response: Response } {
  const { socket, response } = Deno.upgradeWebSocket(req);
  return { socket, response };
}
```

## Commit
`feat: add WebSocket upgrade handling`
