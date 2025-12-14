# Feature: openapi-emitter - Research

## OpenAPI 3.x Structure

### Document Root

```yaml
openapi: "3.0.3"
info:
  title: "My API"
  version: "1.0.0"
  description: "API description"
servers:
  - url: "https://api.example.com"
    description: "Production"
paths:
  /users:
    get: { ... }
    post: { ... }
components:
  schemas:
    User: { ... }
```

### Path Item Object

```yaml
/users/{id}:
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: string
  get:
    operationId: getUser
    responses:
      "200":
        description: Success
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/User"
```

### Operation Object

```yaml
get:
  operationId: getUser
  tags:
    - Users
  summary: Get a user by ID
  description: Retrieves a user from the database
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: string
  responses:
    "200":
      description: Successful response
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/User"
    "404":
      description: User not found
```

### Request Body Object

```yaml
post:
  operationId: createUser
  requestBody:
    required: true
    content:
      application/json:
        schema:
          type: object
          properties:
            name:
              type: string
            email:
              type: string
          required:
            - name
            - email
```

## ContractedAPI to OpenAPI Mapping

### Contract to Operation

| ContractedAPI | OpenAPI |
|---------------|---------|
| `contract.name` | `operationId` |
| `contract.path` | Path key in `paths` |
| `contract.method` | HTTP method key |
| `contract.description` | `summary` |
| `contract.request` | `requestBody.content.*.schema` |
| `contract.response` | `responses.200.content.*.schema` |

### Path Parameter Extraction

```typescript
const PATH_PARAM_REGEX = /\{([^}]+)\}/g;

function extractPathParams(path: string): string[] {
  const params: string[] = [];
  let match;
  while ((match = PATH_PARAM_REGEX.exec(path)) !== null) {
    params.push(match[1]);
  }
  return params;
}

// "/users/{userId}/posts/{postId}"
// → ["userId", "postId"]
```

### Tag Derivation

Use namespace as tag:

```typescript
function deriveTag(contract: Contract): string {
  // From namespace: Api.Users → "Users"
  // Or from path: /api/users → "users"
  const segments = contract.path.split("/").filter(Boolean);
  return segments[segments.length - 1] || "default";
}
```

## Multiple Contracts Per Path

ContractedAPI can have multiple contracts per path+method (schema dispatch), but OpenAPI only allows one operation per path+method.

Options:
1. **First contract wins** - Use first contract only
2. **Merge schemas** - Combine with oneOf
3. **Error** - Reject incompatible spec

### oneOf Merge Strategy

```yaml
/users:
  post:
    requestBody:
      content:
        application/json:
          schema:
            oneOf:
              - $ref: "#/components/schemas/CreateUserA"
              - $ref: "#/components/schemas/CreateUserB"
```

## Component Extraction

### Finding Shared Schemas

```typescript
function extractComponents(contracts: Contract[]): ComponentsObject {
  const schemas: Record<string, JSONSchema> = {};

  for (const contract of contracts) {
    // Look for $ref in request/response
    findRefs(contract.request, schemas);
    findRefs(contract.response, schemas);
  }

  return { schemas };
}
```

### Inline vs Reference

Decision: Keep schemas inline or extract to components?

Pros of inline:
- Self-contained operations
- No ref resolution needed

Pros of components:
- Smaller output
- Reusable definitions
- Standard OpenAPI pattern

## OpenAPI Versions

### 3.0.3 vs 3.1.0

Key differences:
- 3.1.0 uses JSON Schema draft 2020-12
- 3.1.0 supports `webhooks`
- 3.1.0 allows `type: null`
- 3.0.x uses `nullable: true`

```yaml
# 3.0.x
type: string
nullable: true

# 3.1.x
type:
  - string
  - "null"
```

## YAML Serialization

### @std/yaml

```typescript
import { stringify } from "@std/yaml";

const yaml = stringify(document, {
  indent: 2,
  lineWidth: 80,
  noRefs: true,  // Expand YAML anchors
});
```

### Formatting Options

```typescript
interface SerializeOptions {
  indent: number;
  lineWidth: number;
  sortKeys: boolean;
}
```

## Validation

### OpenAPI Validator

Use external tools to validate:
- `swagger-cli validate`
- `spectral lint`

Or include runtime validation:
```typescript
import { validate } from "openapi-schema-validator";

function validateOutput(doc: OpenAPIDocument): ValidationResult {
  return validate(doc);
}
```

## Testing Strategy

Test cases:
1. Simple contract to operation
2. Contract with request body
3. Contract without request
4. Path parameters
5. Multiple contracts per path
6. Namespace to tags mapping
7. Component extraction
8. YAML output format
9. JSON output format
10. OpenAPI validation passes
