# Feature: type-inference - Research

## Reference Implementation

From `Claude-Browser-Control-Deno/src/orchestrator/client/utility.ts`:

```typescript
export type ContractByName<
  Contracts extends readonly EndpointContract[],
  Name extends Contracts[number]["name"]
> = Extract<Contracts[number], { name: Name }>;
```

This enables typed extraction:
```typescript
type TargetControl = ContractByName<typeof contracts, "target:control">;
// TargetControl is the full contract type with request/response schemas
```

## Contract Type Inference

```typescript
export type ContractRequest<C extends Contract> =
  C['request'] extends JSONSchema
    ? FromSchema<C['request']>
    : C['request'] extends RequestBodyObject
      ? C['request']['content'][keyof C['request']['content']]['schema'] extends JSONSchema
        ? FromSchema<C['request']['content'][keyof C['request']['content']]['schema']>
        : never
      : never;

export type ContractResponse<C extends Contract> =
  C['response'] extends JSONSchema
    ? FromSchema<C['response']>
    : C['response'] extends ResponseObject
      ? C['response']['content'] extends Record<string, MediaTypeObject>
        ? C['response']['content'][keyof C['response']['content']]['schema'] extends JSONSchema
          ? FromSchema<C['response']['content'][keyof C['response']['content']]['schema']>
          : never
        : never
      : never;

export type ContractError<C extends Contract> =
  C['error'] extends JSONSchema ? FromSchema<C['error']> : never;
```

## Key Capabilities Needed

1. **Contract lookup by name** - Find specific contract from collection
2. **Name extraction** - Get union of all contract names
3. **Binding generation** - Mapped types requiring all contracts
4. **Namespace grouping** - Filter/group contracts by prefix
