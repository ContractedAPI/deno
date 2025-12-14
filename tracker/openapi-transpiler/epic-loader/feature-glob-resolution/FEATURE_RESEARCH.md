# Feature: glob-resolution - Research

## ContractedAPI Glob Syntax

### Pattern Format

The `#./` prefix indicates a glob import:

```yaml
paths:
  "#./cards/*.yaml": {}          # All YAML files in cards/
  "#./cards/**/*.yaml": {}       # Recursive YAML files
  "#./cards/user-*.yaml": {}     # Files matching user-*
```

### Context-Based Override Rules

| Import Location | Path Used | Method Used |
|-----------------|-----------|-------------|
| Root `paths` key | Card's default `path` | Card's default `method` |
| Under a path (`/users:`) | Override: `/users` | Card's default `method` |
| Under a method (`get:`) | Parent path | Override: `get` |

### Example Specification

```yaml
paths:
  # Root level - card provides both path and method
  "#./cards/health-card.yaml": {}

  /users:
    # Path level - /users overrides card path, card provides method
    "#./cards/user-list.yaml": {}

    get:
      # Method level - /users and get both override card defaults
      "#./cards/custom-list.yaml": {}
```

## Deno Standard Library

### @std/fs/expandGlob

```typescript
import { expandGlob } from "@std/fs";

// Basic usage
for await (const entry of expandGlob("**/*.yaml")) {
  console.log(entry.path);   // Absolute path
  console.log(entry.name);   // Filename
  console.log(entry.isFile); // true for files
}

// With options
for await (const entry of expandGlob("**/*.yaml", {
  root: "/some/base/dir",
  includeDirs: false,
  followSymlinks: true,
})) {
  console.log(entry.path);
}
```

### @std/path

```typescript
import {
  resolve,
  dirname,
  normalize,
  toFileUrl,
  fromFileUrl,
} from "@std/path";

// Resolve relative path
const abs = resolve("/base/dir", "../other/file.yaml");

// Get directory
const dir = dirname("/path/to/file.yaml"); // "/path/to"

// Normalize for comparison
const norm = normalize("/path/../other/./file.yaml"); // "/other/file.yaml"
```

## Circular Detection Algorithm

### Simple Approach (Set-based)

```typescript
interface Context {
  visited: Set<string>;
}

function processInclude(path: string, ctx: Context): void {
  const normalized = normalizePath(path);

  if (ctx.visited.has(normalized)) {
    throw new Error(`Circular include: ${path}`);
  }

  const newCtx = {
    visited: new Set([...ctx.visited, normalized]),
  };

  // Process file with newCtx
}
```

### Enhanced Approach (Chain Tracking)

```typescript
interface Context {
  chain: string[];  // Ordered list for error messages
}

function processInclude(path: string, ctx: Context): void {
  const normalized = normalizePath(path);

  const existingIndex = ctx.chain.indexOf(normalized);
  if (existingIndex !== -1) {
    const cycle = ctx.chain.slice(existingIndex).concat(normalized);
    throw new Error(
      `Circular include detected:\n${cycle.join("\n  -> ")}`
    );
  }

  const newCtx = {
    chain: [...ctx.chain, normalized],
  };

  // Process file with newCtx
}
```

## ContractCard Structure

```typescript
interface ContractCard {
  // Required fields
  name: string;        // Contract identifier (colon:case)
  path: string;        // Default path (can be overridden)
  method: HttpMethod;  // Default method (can be overridden)

  // Contract details
  request?: JSONSchema;
  response?: JSONSchema;
  description?: string;

  // Local components (to be merged)
  components?: ComponentsObject;
}
```

## Path Normalization

For reliable circular detection, normalize paths:

```typescript
function normalizePath(path: string): string {
  // Handle file:// URLs
  if (path.startsWith("file://")) {
    path = fromFileUrl(path);
  }

  // Normalize slashes and resolve . and ..
  path = normalize(path);

  // Convert to lowercase on Windows for case-insensitive comparison
  if (Deno.build.os === "windows") {
    path = path.toLowerCase();
  }

  return path;
}
```

## Edge Cases

### Empty Glob Results

```typescript
const files: string[] = [];
for await (const entry of expandGlob(pattern)) {
  files.push(entry.path);
}

if (files.length === 0) {
  // Option 1: Warn and continue
  console.warn(`No files matched pattern: ${pattern}`);

  // Option 2: Throw error
  throw new Error(`No files matched pattern: ${pattern}`);
}
```

### Invalid Card Structure

```typescript
function validateCard(raw: unknown, filePath: string): ContractCard {
  if (typeof raw !== "object" || raw === null) {
    throw new Error(`Invalid contract card in ${filePath}: expected object`);
  }

  const obj = raw as Record<string, unknown>;

  if (typeof obj.name !== "string") {
    throw new Error(`Invalid contract card in ${filePath}: missing 'name'`);
  }

  // ... more validation
}
```

## Testing Strategy

Test cases:
1. Simple glob matching files
2. Recursive glob (`**/*.yaml`)
3. No matches (empty result)
4. Direct circular include (A -> A)
5. Indirect circular include (A -> B -> A)
6. Path override at path level
7. Method override at method level
8. Combined path + method override
9. Windows vs Unix path handling
