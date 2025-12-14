# Feature: websocket - Checklist

## Gantt Chart

```mermaid
gantt
    title Feature: websocket Implementation
    dateFormat  YYYY-MM-DD
    section Core
        Upgrade handling         :t1, 2025-01-01, 1d
        Connection management    :t2, after t1, 2d
        Message handling         :t3, after t2, 2d
    section Features
        Broadcast/unicast        :t4, after t3, 1d
        Heartbeat                :t5, after t4, 1d
    section Testing
        Unit tests               :t6, after t5, 1d
```

## Task Checklist

- [ ] Implement WebSocket upgrade detection
- [ ] Create connection registry
- [ ] Implement message parsing and validation
- [ ] Create typed message handlers
- [ ] Implement broadcast to all connections
- [ ] Implement unicast to specific connection
- [ ] Add heartbeat/ping-pong
- [ ] Write unit tests

## Acceptance Criteria

- [ ] HTTP upgrades to WebSocket
- [ ] Messages validated against schema
- [ ] Connections tracked properly
- [ ] Clean disconnect handling
