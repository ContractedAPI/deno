# Task: json-types - Checklist

## Implementation Checklist

- [ ] Create `src/schema/types.ts` file
- [ ] Define `JSONPrimitive = string | number | boolean | null`
- [ ] Define `JSONArray = JSONValue[]`
- [ ] Define `JSONObject = { [key: string]: JSONValue }`
- [ ] Define `JSONValue = JSONPrimitive | JSONArray | JSONObject`
- [ ] Re-export `JSONSchema` from `json-schema-to-ts`
- [ ] Add JSDoc comments to all types
- [ ] Verify types compile under `strict: true`

## Acceptance Criteria

- [ ] All types compile without errors
- [ ] Types are properly recursive (JSONValue can contain JSONValue)
- [ ] JSDoc comments present on all exports
