# Task: info-server-types - Checklist

## Implementation Checklist

- [x] Create `src/spec/openapi.ts`
- [x] Define `ContactObject` (name?, email?, url?)
- [x] Define `LicenseObject` (name, url?)
- [x] Define `InfoObject` (title, version, description?, contact?, license?)
- [x] Define `ServerVariableObject` (enum?, default, description?)
- [x] Define `ServerObject` (url, description?, variables?)
- [x] Define `TagObject` (name, description?, externalDocs?)
- [x] Define `ExternalDocumentationObject` (url, description?)
- [x] Add JSDoc comments to all types

## Acceptance Criteria

- [x] All types compile under `strict: true`
- [x] Optional fields correctly marked
- [x] JSDoc comments present
