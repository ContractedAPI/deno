# Feature: websocket

## Overview

Implement WebSocket support for ContractedAPI servers. This feature enables real-time bidirectional communication with typed message contracts.

## Key Deliverables

- WebSocket upgrade handling
- Typed message contracts
- Connection lifecycle management
- Broadcast and unicast messaging
- Heartbeat/ping-pong support

## File Structure

```
src/server/
├── websocket.ts        # WebSocket handling
├── connection.ts       # Connection management
└── types.ts            # WebSocketContract types
```

## Dependencies

### External
- Deno native WebSocket API

### Internal
- epic-spec-types (message schemas)
- feature-validation (message validation)

## Dependents

- feature-error-handling (WebSocket errors)

## Acceptance Criteria

- [ ] Upgrades HTTP to WebSocket
- [ ] Validates incoming messages
- [ ] Sends typed responses
- [ ] Handles connection lifecycle
- [ ] Supports multiple connections
