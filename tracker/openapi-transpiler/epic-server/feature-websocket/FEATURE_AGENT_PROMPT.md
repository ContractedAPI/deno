# Feature: websocket - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicServer.FeatureWebsocket`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-server/feature-websocket/feature`

## Context

You are implementing WebSocket support for ContractedAPI servers using Deno's native WebSocket API.

## Key Implementation

```typescript
function handleWebSocket(request: Request): Response {
  const { socket, response } = Deno.upgradeWebSocket(request);

  socket.onopen = () => { /* ... */ };
  socket.onmessage = (event) => { /* ... */ };
  socket.onclose = () => { /* ... */ };
  socket.onerror = (error) => { /* ... */ };

  return response;
}
```

## Commit Guidelines

- Conventional commit style, micro-commits (~20 lines)

## Important Reminders

1. Stay in your worktree
2. Check the checklist in FEATURE_CHECKLIST.md
