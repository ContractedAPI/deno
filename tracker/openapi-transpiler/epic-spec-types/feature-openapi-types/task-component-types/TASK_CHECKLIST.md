# Task: component-types - Checklist

## Implementation Checklist

- [ ] Define `ReferenceObject` type (`{ $ref: string }`)
- [ ] Define `HttpMethod` type union (get, post, put, patch, delete, head, options, trace)
- [ ] Define `ComponentsObject` type with all component containers
- [ ] Add JSDoc comments

## Acceptance Criteria

- [ ] ReferenceObject only allows `$ref` property
- [ ] HttpMethod includes all standard methods
- [ ] ComponentsObject has all OpenAPI 3.1 component types
