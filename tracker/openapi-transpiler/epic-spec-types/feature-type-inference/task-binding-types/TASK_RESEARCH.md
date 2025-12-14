# Task: binding-types - Research

## Reference

From the reference project, binding types enforce complete implementations:

```typescript
export type Binding<T> = {
  "root:health": T;
  "root:list": T;
  "root:killAll": T;
};
```

## Purpose

Binding types ensure:
1. All contracts are implemented
2. TypeScript errors if a contract is missing
3. Type-safe dispatch to handlers

## Usage Pattern

```typescript
// Define handlers type
type Handlers = ContractBinding<typeof contracts, Handler>;

// TypeScript ensures all contracts have handlers
const handlers: Handlers = {
  "user:list": listHandler,
  "user:get": getHandler,
  // Missing "user:create" would cause type error
};
```
