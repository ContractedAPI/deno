# Feature: namespace-builder - Research

## Reference Project Pattern

The reference project derives namespaces from contract names (colon-separated):

```
Contract: "root:health"    → Namespace: Root,    Action: health
Contract: "target:control" → Namespace: Target,  Action: control
Contract: "node:create"    → Namespace: Node,    Action: create
```

## ContractedAPI Pattern

The new system derives namespaces from URL paths instead:

```
Path: /api/users        → Namespace: Api.Users
Path: /api/users/{id}   → Namespace: Api.Users (or Api.Users.Id)
Path: /auth/login       → Namespace: Auth
Path: /                 → Namespace: Root
```

## Conversion Algorithm

### Step 1: Parse Path

```typescript
function pathToSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

// Examples:
// "/"              → []
// "/users"         → ["users"]
// "/api/users"     → ["api", "users"]
// "/users/{id}"    → ["users", "{id}"]
```

### Step 2: Convert Segments

```typescript
function segmentToNamespace(segment: string): string {
  // Path parameter
  if (segment.startsWith("{")) {
    return toPascalCase(segment.slice(1, -1));
  }

  // Normal segment
  return toPascalCase(segment);
}

function toPascalCase(str: string): string {
  // Handle kebab-case and snake_case
  return str
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

// Examples:
// "users"      → "Users"
// "user-posts" → "UserPosts"
// "user_data"  → "UserData"
// "{id}"       → "Id"
// "{userId}"   → "UserId"
```

### Step 3: Join Segments

```typescript
function pathToNamespace(path: string): string {
  const segments = pathToSegments(path);

  if (segments.length === 0) {
    return "Root";
  }

  return segments.map(segmentToNamespace).join(".");
}

// Examples:
// "/"              → "Root"
// "/users"         → "Users"
// "/api/users"     → "Api.Users"
// "/api/users/{id}" → "Api.Users.Id"
```

## Path Parameter Strategies

### Strategy: Flatten

Ignore path parameters, group all under parent:

```
/users          → Users
/users/{id}     → Users
/users/{id}/posts → Users.Posts
```

Pros: Simpler namespaces, fewer levels
Cons: Different contracts share namespace

### Strategy: Include

Include path parameters as namespace segments:

```
/users          → Users
/users/{id}     → Users.Id
/users/{id}/posts → Users.Id.Posts
```

Pros: Precise grouping
Cons: Deeper nesting

### Strategy: Action-Based

Derive action from method + path:

```
GET /users      → Users.List
POST /users     → Users.Create
GET /users/{id} → Users.Get
DELETE /users/{id} → Users.Delete
```

Pros: RESTful organization
Cons: More complex derivation

## Namespace Tree Structure

```typescript
interface NamespaceNode {
  name: string;                     // "Users"
  fullPath: string;                 // "Api.Users"
  children: Map<string, NamespaceNode>;
  contracts: Contract[];
}

// Example tree for paths:
// /api/users
// /api/users/{id}
// /api/posts

Root
├── Api
│   ├── Users (contracts: GET /api/users, POST /api/users)
│   │   └── Id (contracts: GET /api/users/{id}, DELETE /api/users/{id})
│   └── Posts (contracts: GET /api/posts)
```

## Valid TypeScript Identifiers

Namespace names must be valid TypeScript identifiers:

```typescript
// Valid
namespace Users {}
namespace Api {}
namespace UserPosts {}

// Invalid (must be escaped or transformed)
namespace 123Users {}    // Cannot start with number
namespace user-posts {}  // Hyphens not allowed
namespace class {}       // Reserved word
```

### Reserved Words

```typescript
const RESERVED = new Set([
  "break", "case", "catch", "class", "const", "continue",
  "debugger", "default", "delete", "do", "else", "enum",
  "export", "extends", "false", "finally", "for", "function",
  "if", "import", "in", "instanceof", "new", "null",
  "return", "super", "switch", "this", "throw", "true",
  "try", "typeof", "var", "void", "while", "with",
]);

function isValidIdentifier(name: string): boolean {
  if (RESERVED.has(name.toLowerCase())) return false;
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}
```

## Edge Cases

### Root Path

```
Path: /
Namespace: Root
```

### Single Segment

```
Path: /health
Namespace: Health
```

### Deep Nesting

```
Path: /api/v1/users/{userId}/posts/{postId}/comments
Namespace: Api.V1.Users.UserId.Posts.PostId.Comments
```

Recommendation: Consider max depth limit or flattening.

### Numeric Prefixes

```
Path: /v1/users
Segment: v1 → V1 (valid)

Path: /1.0/users
Segment: 1.0 → Invalid!
Transform: _1_0 or Version1_0
```

## Testing Strategy

Test cases:
1. Root path `/`
2. Single segment `/users`
3. Multiple segments `/api/users`
4. Path parameters `/users/{id}`
5. Nested parameters `/users/{id}/posts/{postId}`
6. Kebab-case `/user-posts`
7. Snake_case `/user_posts`
8. Numeric versions `/v1/users`
9. Reserved words (if applicable)
10. Deep nesting (5+ levels)
