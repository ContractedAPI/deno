# Feature: schema-types - Research

## FromSchema Wrapper Pattern

From reference project `Claude-Browser-Control-Deno/src/orchestrator/schema.ts`:

```typescript
import type { JSONSchema, FromSchema as CoreFromSchema } from "json-schema-to-ts";

export type FromSchema<SCHEMA extends JSONSchema, OPTIONS extends FromSchemaOptions = FromSchemaDefaultOptions> =
  CoreFromSchema<SCHEMA, OPTIONS> extends { [x: string]: unknown; }
    ? CoreFromSchema<SCHEMA, OPTIONS> & JSONObject
    : CoreFromSchema<SCHEMA, OPTIONS>;
```

## JSON Serializable Types

```typescript
export type JSONPrimitive = string | number | boolean | null;
export type JSONArray = JSONSerializable[];
export type JSONObject = { [key: string]: JSONSerializable };
export type JSONSerializable = JSONPrimitive | JSONObject | JSONArray;
```

## json-schema-to-ts Known Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| `$ref` resolution | Must pass explicit `references` array | Pre-resolve refs during load |
| `not` keyword | Requires opt-in | Avoid or use `parseNotKeyword` |
| `if/then/else` | Requires opt-in | Avoid or use `parseIfThenElseKeywords` |
| TypeScript config | Requires `strict: true` | Configure tsconfig |
| `as const` requirement | Schema loses type hints | Accept tradeoff |
