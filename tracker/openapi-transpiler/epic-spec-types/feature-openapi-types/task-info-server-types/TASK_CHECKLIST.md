# Task: info-server-types - Checklist

## Implementation Checklist

- [ ] Create `src/spec/openapi.ts`
- [ ] Define `ContactObject` (name?, email?, url?)
- [ ] Define `LicenseObject` (name, url?)
- [ ] Define `InfoObject` (title, version, description?, contact?, license?)
- [ ] Define `ServerVariableObject` (enum?, default, description?)
- [ ] Define `ServerObject` (url, description?, variables?)
- [ ] Define `TagObject` (name, description?, externalDocs?)
- [ ] Define `ExternalDocumentationObject` (url, description?)
- [ ] Add JSDoc comments to all types

## Acceptance Criteria

- [ ] All types compile under `strict: true`
- [ ] Optional fields correctly marked
- [ ] JSDoc comments present
