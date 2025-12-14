# Task: contract-lookup - Research

## Reference

From `Claude-Browser-Control-Deno/src/orchestrator/client/utility.ts`:

```typescript
export type ContractByName<
  Contracts extends readonly EndpointContract[],
  Name extends Contracts[number]["name"]
> = Extract<Contracts[number], { name: Name }>;
```

## Extract Utility Type

TypeScript's `Extract<T, U>` extracts from T those types assignable to U:

```typescript
Extract<Contracts[number], { name: Name }>
```

This finds the contract object where `name` matches.

## Why Readonly Arrays?

Using `readonly { name: string }[]` allows both:
- Mutable arrays
- Const assertions (`as const`)

The contracts array must be `as const` for literal type inference.
