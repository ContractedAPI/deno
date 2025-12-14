# Feature: format-detection - Research

## Reference Implementation

From `Claude-Browser-Control-Deno/src/orchestrator/loader.ts`:

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

## Deno Standard Library

### @std/yaml

```typescript
import { parse, stringify } from "@std/yaml";

// Parse YAML string to object
const data = parse(`
name: test
version: 1.0.0
`);

// Convert object to YAML string
const yaml = stringify({ name: "test", version: "1.0.0" });
```

Installation:
```bash
deno add @std/yaml
```

### @std/toml

```typescript
import { parse, stringify } from "@std/toml";

// Parse TOML string to object
const data = parse(`
[package]
name = "test"
version = "1.0.0"
`);

// Convert object to TOML string
const toml = stringify({ package: { name: "test", version: "1.0.0" } });
```

Installation:
```bash
deno add @std/toml
```

## Extension Mapping

| Extension | Format | Notes |
|-----------|--------|-------|
| `.json` | json | Standard JSON |
| `.yaml` | yaml | YAML 1.2 |
| `.yml` | yaml | Alternate extension |
| `.toml` | toml | TOML 1.0 |

## Edge Cases

### Empty Files

```typescript
// YAML: Empty file returns undefined
parse("") // undefined

// JSON: Empty file throws
JSON.parse("") // SyntaxError

// TOML: Empty file returns empty object
parse("") // {}
```

Recommendation: Normalize to return `{}` for all empty files.

### Case Sensitivity

File extensions should be case-insensitive:
- `.YAML` -> yaml
- `.Json` -> json
- `.TOML` -> toml

### URL-Based Paths

When detecting format from URLs:
```typescript
function detectFormat(pathOrUrl: string): Format {
  // Remove query string and hash
  const cleanPath = pathOrUrl.split("?")[0].split("#")[0];
  const ext = cleanPath.split(".").pop()?.toLowerCase();
  // ...
}
```

## Error Message Format

Good error messages should include:
1. What failed (parsing)
2. Which file
3. Line/column if available
4. Original error message

```
Failed to parse config.yaml: unexpected token at line 5, column 3
  5 |   invalid: - value
             ^
```

## Performance Notes

- YAML parsing is slower than JSON (~10-50x)
- TOML parsing is moderate
- For large specs, consider caching parsed results

## Testing Strategy

Test cases:
1. Valid files of each format
2. Empty files
3. Invalid syntax
4. Unknown extension
5. Mixed case extensions
6. Files with BOM (byte order mark)
7. Files with different line endings (CRLF vs LF)
