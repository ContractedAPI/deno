# Task: json-types - Research

## Reference

See [FEATURE_RESEARCH.md](../FEATURE_RESEARCH.md) and [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for comprehensive background.

## Key Points

### JSON Type Hierarchy

```
JSONValue
├── JSONPrimitive (string | number | boolean | null)
├── JSONArray (JSONValue[])
└── JSONObject ({ [key: string]: JSONValue })
```

### Why These Types?

1. **Type Safety**: Ensure only JSON-serializable data flows through the system
2. **FromSchema Foundation**: These types are used in the `& JSONObject` correction
3. **Schema Validation**: Runtime validation can use these as constraints

### json-schema-to-ts Dependency

The `JSONSchema` type comes from `json-schema-to-ts`. Ensure this is configured in `deno.json`:

```json
{
  "imports": {
    "json-schema-to-ts": "npm:json-schema-to-ts@^3.0.0"
  }
}
```
