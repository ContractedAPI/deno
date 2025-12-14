# Task: contract-extractors - Research

## Reference

See [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for type inference patterns.

## Conditional Type Pattern

Use conditional types to extract nested schema types:

```typescript
type ContractRequest<C> = C["request"] extends JSONSchema
  ? FromSchema<C["request"]>
  : undefined;
```

This checks if `request` is a JSONSchema and applies FromSchema, otherwise returns `undefined`.

## Usage Pattern

```typescript
const UserContract = {
  request: { type: "object", properties: { name: { type: "string" } } } as const,
  response: { type: "object", properties: { id: { type: "string" } } } as const,
};

type UserRequest = ContractRequest<typeof UserContract>;
// { name?: string }
```
