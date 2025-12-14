# Feature: output-formats - Research

## Output Format Requirements

### TypeScript Output

```
generated/
└── api.ts              # All contracts, types, namespaces
```

Single file containing:
- Contracts array
- Base types
- Namespace declarations
- Binding types

### OpenAPI Output

```
generated/
├── openapi.yaml        # YAML format
└── openapi.json        # JSON format (optional)
```

Standard OpenAPI 3.x document.

## File System Operations

### Deno APIs

```typescript
// Write file
await Deno.writeTextFile(path, content);

// Read file
const content = await Deno.readTextFile(path);

// Check if exists
const exists = await Deno.stat(path).then(() => true).catch(() => false);

// Create directory
await Deno.mkdir(path, { recursive: true });

// Rename (atomic move)
await Deno.rename(oldPath, newPath);

// Watch for changes
const watcher = Deno.watchFs(path);
for await (const event of watcher) {
  console.log(event.kind, event.paths);
}
```

### @std/fs

```typescript
import { ensureDir, ensureFile, copy, move } from "@std/fs";

// Ensure directory exists (creates if missing)
await ensureDir("./generated");

// Ensure file exists (creates empty if missing)
await ensureFile("./generated/api.ts");
```

## Atomic File Writing

Prevent partial writes on crash:

```typescript
async function writeAtomic(path: string, content: string): Promise<void> {
  const tempPath = `${path}.${Date.now()}.tmp`;

  try {
    // Write to temp file
    await Deno.writeTextFile(tempPath, content);

    // Atomic rename
    await Deno.rename(tempPath, path);
  } catch (error) {
    // Clean up temp file on failure
    try {
      await Deno.remove(tempPath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}
```

## Watch Mode Implementation

### Basic Watch

```typescript
async function watch(paths: string[]): Promise<void> {
  const watcher = Deno.watchFs(paths);

  for await (const event of watcher) {
    console.log(`${event.kind}: ${event.paths.join(", ")}`);
  }
}
```

### Debounced Watch

Many editors trigger multiple events per save:

```typescript
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): T {
  let timer: number | undefined;

  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

async function watchDebounced(
  path: string,
  callback: () => Promise<void>,
  delay = 100
): Promise<void> {
  const watcher = Deno.watchFs(path);
  const debouncedCallback = debounce(callback, delay);

  for await (const event of watcher) {
    if (event.kind === "modify" || event.kind === "create") {
      debouncedCallback();
    }
  }
}
```

### Watch with Glob

Watch multiple files matching pattern:

```typescript
import { expandGlob } from "@std/fs";

async function watchGlob(
  pattern: string,
  callback: (path: string) => Promise<void>
): Promise<void> {
  const paths: string[] = [];

  for await (const entry of expandGlob(pattern)) {
    paths.push(entry.path);
  }

  const watcher = Deno.watchFs(paths);

  for await (const event of watcher) {
    if (event.kind === "modify") {
      for (const path of event.paths) {
        await callback(path);
      }
    }
  }
}
```

## Error Handling

### Write Errors

```typescript
async function writeOutput(path: string, content: string): Promise<void> {
  try {
    await ensureDir(dirname(path));
    await Deno.writeTextFile(path, content);
  } catch (error) {
    if (error instanceof Deno.errors.PermissionDenied) {
      throw new Error(`Permission denied: Cannot write to ${path}`);
    }
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`Path not found: ${dirname(path)}`);
    }
    throw error;
  }
}
```

### Partial Failure Handling

Continue on single format failure:

```typescript
for (const format of config.formats) {
  try {
    await generateAndWrite(spec, format, config);
  } catch (error) {
    errors.push({
      format,
      error: error instanceof Error ? error : new Error(String(error)),
    });
    // Continue with other formats
  }
}
```

## Result Reporting

### TranspileResult

```typescript
interface TranspileResult {
  success: boolean;
  files: FileResult[];
  errors: FormatError[];
  duration: number;
}

interface FileResult {
  path: string;
  format: OutputFormat;
  size: number;
}

interface FormatError {
  format: OutputFormat;
  error: Error;
}
```

### Console Output

```typescript
function reportResult(result: TranspileResult): void {
  if (result.success) {
    console.log(`Transpiled ${result.files.length} files in ${result.duration}ms:`);
    for (const file of result.files) {
      console.log(`  ${file.path} (${formatSize(file.size)})`);
    }
  } else {
    console.error(`Transpilation failed with ${result.errors.length} errors:`);
    for (const { format, error } of result.errors) {
      console.error(`  ${format}: ${error.message}`);
    }
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
```

## Testing Strategy

Test cases:
1. Single format output
2. Multiple format output
3. Custom output paths
4. Directory creation
5. Write permission errors
6. Atomic write (crash simulation)
7. Watch mode trigger
8. Debounce rapid changes
9. Result reporting
10. Error aggregation
