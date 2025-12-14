# Epic: loader - Research

## Reference Implementation Analysis

From `Claude-Browser-Control-Deno/src/orchestrator/loader.ts` (~406 lines):

### Core Types

```typescript
// Contract file structure with optional base override
interface ContractFile {
  base?: string;
  contracts: EndpointContract[];
}

// Loaded contracts with resolved base URL
interface LoadedContracts {
  base: string;           // Resolved absolute base URL
  originalBase?: string;  // Original base from file
  contracts: EndpointContract[];
}

type Format = "json" | "yaml" | "toml";
```

### Format Detection Pattern

```typescript
function detectFormat(path: string): Format {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "yaml":
    case "yml":
      return "yaml";
    case "toml":
      return "toml";
    case "json":
      return "json";
    default:
      throw new Error(`Unknown file extension: .${ext}`);
  }
}
```

### Include Resolution Pattern

The reference uses `$include` for importing:

```typescript
async function processIncludes(
  data: unknown,
  currentFile: string,
  visited: Set<string> = new Set()  // Circular detection
): Promise<unknown> {
  // Handle arrays - flatten included arrays
  if (Array.isArray(data)) {
    const results: unknown[] = [];
    for (const item of data) {
      const processed = await processIncludes(item, currentFile, visited);
      if (Array.isArray(processed)) {
        results.push(...processed);  // Flatten
      } else {
        results.push(processed);
      }
    }
    return results;
  }

  // Handle objects - check for $include
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;

    if ("$include" in obj && typeof obj.$include === "string") {
      const resolvedPath = resolveIncludePath(obj.$include, currentFile);
      const normalizedPath = /* normalize for comparison */;

      // Circular detection
      if (visited.has(normalizedPath)) {
        throw new Error(`Circular include detected: ${obj.$include}`);
      }

      const newVisited = new Set(visited);
      newVisited.add(normalizedPath);

      const content = await Deno.readTextFile(urlToPath(resolvedPath));
      const format = detectFormat(obj.$include);
      const parsed = parseRaw(content, format);
      return processIncludes(parsed, resolvedPath, newVisited);
    }

    // Recurse into object properties
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = await processIncludes(value, currentFile, visited);
    }
    return result;
  }

  return data;
}
```

### Path Resolution Pattern

```typescript
function resolveIncludePath(includePath: string, currentFile: string): string {
  // Already absolute URL
  if (includePath.startsWith("file://") ||
      includePath.startsWith("http://") ||
      includePath.startsWith("https://")) {
    return includePath;
  }

  // Resolve relative to current file
  const currentUrl = currentFile.startsWith("file://")
    ? currentFile
    : toFileUrl(currentFile).href;
  const currentDir = dirname(currentUrl);
  return new URL(includePath, currentDir + "/").href;
}
```

### Contract Validation Pattern

```typescript
const VALID_METHODS: Method[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"];

function validateContract(data: unknown): EndpointContract {
  if (typeof data !== "object" || data === null) {
    throw new Error("Contract must be an object");
  }

  const obj = data as Record<string, unknown>;

  // Required fields
  if (typeof obj.name !== "string") {
    throw new Error("Contract must have a 'name' string");
  }
  if (typeof obj.path !== "string") {
    throw new Error("Contract must have a 'path' string");
  }
  if (typeof obj.method !== "string" || !VALID_METHODS.includes(obj.method as Method)) {
    throw new Error(`Contract must have a valid 'method': ${VALID_METHODS.join(", ")}`);
  }
  // ... more validation

  return { /* normalized contract */ };
}
```

---

## Glob Pattern Syntax

ContractedAPI uses `#./pattern` syntax instead of `$include`:

### Import Location Rules

| Import Location | Example | Path Used | Method Used |
|-----------------|---------|-----------|-------------|
| Root `paths` key | `"#./cards/*.yaml": {}` | Card's default | Card's default |
| Under a path | `/users: "#./user-card.yaml"` | `/users` | Card's default |
| Under a method | `get: "#./card.yaml"` | Parent path | `get` |

### Example Spec with Globs

```yaml
paths:
  # Import at root - uses card's defaults
  "#./cards/health-card.yaml": {}

  # Import under path - overrides path, keeps card's method
  /users/{id}:
    "#./cards/user-card.yaml": {}

    # Import under method - overrides both path and method
    post:
      "#./cards/create-user-card.yaml": {}

  # Glob pattern - multiple cards
  "#./cards/**/*-card.yaml": {}
```

### ContractCard Structure

```typescript
type ContractCard = Contract & {
  path: string;           // Default path (can be overridden)
  method: HttpMethod;     // Default method (can be overridden)
  name: string;           // Contract name (colon:case)
  components?: ComponentsObject;  // Local components to merge
};
```

---

## $ref Resolution

### JSON Pointer Syntax

```
#/components/schemas/User
│ │          │       │
│ │          │       └── Schema name
│ │          └── Component type
│ └── Root components object
└── Current document
```

### Resolution Algorithm

```typescript
function resolveRef(ref: string, document: Specification): unknown {
  if (!ref.startsWith('#/')) {
    // External ref - preserve for downstream
    return { $ref: ref };
  }

  const pointer = ref.slice(2).split('/');
  let current: unknown = document;

  for (const segment of pointer) {
    if (typeof current !== 'object' || current === null) {
      throw new Error(`Cannot resolve ${ref}: path not found`);
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}
```

### Circular Reference Detection

Track visited refs during resolution:

```typescript
function resolveRefs(
  data: unknown,
  document: Specification,
  visited: Set<string> = new Set()
): unknown {
  if (typeof data === 'object' && data !== null) {
    if ('$ref' in data) {
      const ref = (data as { $ref: string }).$ref;

      if (visited.has(ref)) {
        throw new Error(`Circular reference detected: ${ref}`);
      }

      visited.add(ref);
      const resolved = resolveRef(ref, document);
      return resolveRefs(resolved, document, visited);
    }

    // Recurse into object/array
  }
  return data;
}
```

---

## Component Merging Strategy

When ContractCards have local `components`, they must be merged:

### Merge Rules

1. **No conflict**: Component doesn't exist in main spec → add it
2. **Same definition**: Component exists with identical schema → keep one
3. **Different definition**: Component exists with different schema → **ERROR** or namespace

### Namespace Strategy (Optional)

```typescript
// Original card component
components:
  schemas:
    User: { ... }

// After merge with namespace prefix
components:
  schemas:
    UserCard_User: { ... }  // Prefixed to avoid conflicts
```

### Merge Implementation Sketch

```typescript
function mergeComponents(
  main: ComponentsObject,
  card: ComponentsObject,
  cardName: string,
  strategy: 'error' | 'namespace' | 'first-wins' | 'last-wins'
): ComponentsObject {
  const result = { ...main };

  for (const [type, components] of Object.entries(card)) {
    // type = 'schemas' | 'responses' | 'parameters' | etc.
    if (!result[type]) {
      result[type] = {};
    }

    for (const [name, schema] of Object.entries(components)) {
      if (result[type][name]) {
        // Conflict!
        switch (strategy) {
          case 'error':
            throw new Error(`Component conflict: ${type}/${name}`);
          case 'namespace':
            result[type][`${cardName}_${name}`] = schema;
            break;
          case 'first-wins':
            // Keep existing
            break;
          case 'last-wins':
            result[type][name] = schema;
            break;
        }
      } else {
        result[type][name] = schema;
      }
    }
  }

  return result;
}
```

---

## Deno Standard Library APIs

### @std/yaml

```typescript
import { parse } from "@std/yaml";
const data = parse(yamlString);
```

### @std/toml

```typescript
import { parse } from "@std/toml";
const data = parse(tomlString);
```

### @std/path

```typescript
import { dirname, toFileUrl, fromFileUrl } from "@std/path";
```

### @std/fs (Glob)

```typescript
import { expandGlob } from "@std/fs";

for await (const entry of expandGlob("**/*.yaml")) {
  console.log(entry.path);
}
```

---

## Research Topics

- [x] Reference loader.ts analysis (documented above)
- [x] Format detection pattern (documented above)
- [x] Include/glob resolution pattern (documented above)
- [x] Circular reference detection (documented above)
- [x] Component merge strategies (documented above)
- [ ] Performance optimization for large specs
- [ ] Error message formatting with context
- [ ] Watch mode implementation
