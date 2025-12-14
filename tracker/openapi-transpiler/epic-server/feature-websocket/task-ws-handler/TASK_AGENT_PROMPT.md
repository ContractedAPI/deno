# Task: ws-handler - Agent Prompt

> **Branch**: `openapi-transpiler/epic-server/feature-websocket/task-ws-handler/task`

## Implementation
```typescript
export class ConnectionRegistry {
  private connections = new Map<string, WebSocket>();

  add(id: string, socket: WebSocket): void {
    this.connections.set(id, socket);
    socket.onclose = () => this.connections.delete(id);
  }

  get(id: string): WebSocket | undefined {
    return this.connections.get(id);
  }

  broadcast(message: string): void {
    for (const socket of this.connections.values()) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    }
  }

  unicast(id: string, message: string): boolean {
    const socket = this.connections.get(id);
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(message);
      return true;
    }
    return false;
  }
}

export function handleMessage(socket: WebSocket, handler: (data: unknown) => void): void {
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handler(data);
    } catch {
      socket.send(JSON.stringify({ error: 'Invalid JSON' }));
    }
  };
}
```

## Commit
`feat: add WebSocket message handling`
