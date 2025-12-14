# Feature: websocket - Research

## Deno WebSocket API

```typescript
// Check for upgrade request
if (request.headers.get("upgrade") === "websocket") {
  const { socket, response } = Deno.upgradeWebSocket(request);

  socket.onopen = () => {
    console.log("Connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Handle message
  };

  socket.onclose = () => {
    console.log("Disconnected");
  };

  return response;
}
```

## Connection Registry

```typescript
class ConnectionRegistry {
  private connections = new Map<string, WebSocket>();

  add(id: string, socket: WebSocket): void {
    this.connections.set(id, socket);
  }

  remove(id: string): void {
    this.connections.delete(id);
  }

  broadcast(message: unknown): void {
    const data = JSON.stringify(message);
    for (const socket of this.connections.values()) {
      socket.send(data);
    }
  }

  send(id: string, message: unknown): void {
    const socket = this.connections.get(id);
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  }
}
```

## Testing Strategy

- Upgrade request handling
- Message send/receive
- Connection tracking
- Broadcast to all
- Clean disconnect
