# Epic: cli - Research

## Command Tree Generation

### Path to Command Mapping

Contract paths follow REST conventions that map naturally to CLI commands:

```
Contract Path           HTTP Method    CLI Command
---------------------------------------------------------------------------
/users                  GET            contracted users list
/users                  POST           contracted users create
/users/{id}             GET            contracted users <id> get
/users/{id}             PUT            contracted users <id> update
/users/{id}             DELETE         contracted users <id> delete
/users/{id}/posts       GET            contracted users <id> posts list
/users/{id}/posts/{pid} GET            contracted users <id> posts <pid> get
```

### Command Name Derivation

Order of preference for subcommand names:
1. `contract.operationId` (if specified)
2. `contract.name` (ContractedAPI-specific)
3. Method-based defaults:
   - GET (collection) -> `list`
   - GET (resource) -> `get`
   - POST -> `create`
   - PUT -> `update`
   - PATCH -> `patch`
   - DELETE -> `delete`

### Tree Builder Implementation

```typescript
interface CommandNode {
  name: string;
  children: Map<string, CommandNode>;
  commands: Map<string, ContractCommand>;
  isPathParam: boolean;
  paramName?: string;
}

class CommandTreeBuilder {
  root: CommandNode = {
    name: "root",
    children: new Map(),
    commands: new Map(),
    isPathParam: false,
  };

  add(contract: EndpointContract): void {
    const segments = this.parsePathSegments(contract.path);
    let current = this.root;

    for (const segment of segments) {
      const isParam = segment.startsWith("{");
      const key = isParam ? "*" : segment;

      if (!current.children.has(key)) {
        current.children.set(key, {
          name: isParam ? segment.slice(1, -1) : segment,
          children: new Map(),
          commands: new Map(),
          isPathParam: isParam,
          paramName: isParam ? segment.slice(1, -1) : undefined,
        });
      }
      current = current.children.get(key)!;
    }

    const cmdName = this.deriveCommandName(contract);
    current.commands.set(cmdName, {
      contract,
      name: cmdName,
    });
  }

  private parsePathSegments(path: string): string[] {
    return path.split("/").filter(Boolean);
  }

  private deriveCommandName(contract: EndpointContract): string {
    if (contract.operationId) return contract.operationId;
    // Fallback to method-based naming
    const hasPathParam = contract.path.includes("{");
    switch (contract.method.toUpperCase()) {
      case "GET": return hasPathParam ? "get" : "list";
      case "POST": return "create";
      case "PUT": return "update";
      case "PATCH": return "patch";
      case "DELETE": return "delete";
      default: return contract.method.toLowerCase();
    }
  }
}
```

## Argument Parsing

### Schema Property to Argument Mapping

```typescript
interface SchemaProperty {
  type: string;
  description?: string;
  default?: unknown;
  enum?: unknown[];
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

interface CLIArgument {
  name: string;
  flag: string;        // e.g., "--name" or "-n"
  type: "string" | "number" | "boolean" | "array" | "object";
  required: boolean;
  default?: unknown;
  description?: string;
  choices?: unknown[]; // From enum
  validate?: (value: unknown) => boolean;
}

function schemaPropertyToArg(
  name: string,
  prop: SchemaProperty,
  required: boolean
): CLIArgument {
  return {
    name,
    flag: `--${kebabCase(name)}`,
    type: mapSchemaType(prop.type),
    required,
    default: prop.default,
    description: prop.description,
    choices: prop.enum,
    validate: buildValidator(prop),
  };
}
```

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

// /users/{userId}/posts/{postId}
// -> ["userId", "postId"]
```

### Type Coercion Rules

| Schema Type | CLI Input | Coercion |
|-------------|-----------|----------|
| `string` | `"hello"` | Pass through |
| `integer` | `"42"` | `parseInt(value, 10)` |
| `number` | `"3.14"` | `parseFloat(value)` |
| `boolean` | `"true"` / `"false"` | `value === "true"` |
| `boolean` | (flag present) | `true` |
| `array` | `"a,b,c"` | `value.split(",")` |
| `array` | `--item a --item b` | Collect multiple |
| `object` | `'{"key":"value"}'` | `JSON.parse(value)` |
| `object` | `@file.json` | Read and parse file |

### Validation

```typescript
function validateArgument(arg: CLIArgument, value: unknown): ValidationResult {
  const errors: string[] = [];

  // Required check
  if (arg.required && value === undefined) {
    errors.push(`Missing required argument: ${arg.flag}`);
  }

  // Type check
  if (value !== undefined && typeof value !== arg.type) {
    errors.push(`${arg.flag} must be a ${arg.type}`);
  }

  // Enum check
  if (arg.choices && !arg.choices.includes(value)) {
    errors.push(`${arg.flag} must be one of: ${arg.choices.join(", ")}`);
  }

  // Custom validation
  if (arg.validate && !arg.validate(value)) {
    errors.push(`${arg.flag} failed validation`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

## Output Formatting

### JSON Formatter

```typescript
class JSONFormatter implements OutputFormatter {
  format(data: unknown, options?: { pretty?: boolean }): string {
    if (options?.pretty ?? true) {
      return JSON.stringify(data, null, 2);
    }
    return JSON.stringify(data);
  }
}
```

### Table Formatter

```typescript
class TableFormatter implements OutputFormatter {
  format(data: unknown): string {
    if (!Array.isArray(data)) {
      return this.formatObject(data as Record<string, unknown>);
    }
    return this.formatArray(data);
  }

  private formatArray(data: unknown[]): string {
    if (data.length === 0) return "(empty)";

    const headers = Object.keys(data[0] as object);
    const rows = data.map(item =>
      headers.map(h => String((item as Record<string, unknown>)[h] ?? ""))
    );

    return this.renderTable(headers, rows);
  }

  private formatObject(data: Record<string, unknown>): string {
    const rows = Object.entries(data).map(([key, value]) => [
      key,
      typeof value === "object" ? JSON.stringify(value) : String(value),
    ]);
    return this.renderTable(["Key", "Value"], rows);
  }

  private renderTable(headers: string[], rows: string[][]): string {
    // Calculate column widths
    const widths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map(r => r[i]?.length ?? 0))
    );

    // Build table
    const hr = "+" + widths.map(w => "-".repeat(w + 2)).join("+") + "+";
    const headerRow = "|" + headers.map((h, i) =>
      ` ${h.padEnd(widths[i])} `
    ).join("|") + "|";
    const dataRows = rows.map(row =>
      "|" + row.map((cell, i) => ` ${cell.padEnd(widths[i])} `).join("|") + "|"
    );

    return [hr, headerRow, hr, ...dataRows, hr].join("\n");
  }
}
```

### Plain Formatter

```typescript
class PlainFormatter implements OutputFormatter {
  format(data: unknown): string {
    if (Array.isArray(data)) {
      return data.map(item => this.formatValue(item)).join("\n");
    }
    return this.formatValue(data);
  }

  private formatValue(value: unknown): string {
    if (typeof value === "object" && value !== null) {
      // For objects, output first "name-like" field
      const obj = value as Record<string, unknown>;
      const nameField = ["name", "title", "id", "key"].find(f => f in obj);
      return String(obj[nameField!] ?? JSON.stringify(obj));
    }
    return String(value);
  }
}
```

## Configuration System

### Config File Format

```typescript
// .contractedrc (JSON)
{
  "baseUrl": "http://localhost:3000",
  "format": "table",
  "timeout": 30000,
  "verbose": false
}

// contracted.config.ts (TypeScript)
export default {
  baseUrl: process.env.API_URL ?? "http://localhost:3000",
  format: "json",
};
```

### Environment Variables

| Variable | Config Key | Description |
|----------|------------|-------------|
| `CONTRACTED_BASE_URL` | `baseUrl` | API base URL |
| `CONTRACTED_FORMAT` | `format` | Output format |
| `CONTRACTED_TIMEOUT` | `timeout` | Request timeout (ms) |
| `CONTRACTED_VERBOSE` | `verbose` | Enable verbose output |
| `NO_COLOR` | (special) | Disable colored output |

### Config Resolution

```typescript
async function loadConfig(): Promise<CLIConfig> {
  const defaults: CLIConfig = {
    format: "json",
    timeout: 30000,
    verbose: false,
  };

  // Layer 1: Home directory config
  const homeConfig = await loadConfigFile(
    join(homedir(), ".contractedrc")
  );

  // Layer 2: Current directory config
  const localConfig = await loadConfigFile(".contractedrc");

  // Layer 3: TypeScript config
  const tsConfig = await loadTsConfig("contracted.config.ts");

  // Layer 4: Environment variables
  const envConfig = loadEnvConfig();

  return {
    ...defaults,
    ...homeConfig,
    ...localConfig,
    ...tsConfig,
    ...envConfig,
  };
}
```

## Help Generation

### Command Help Structure

```
USAGE:
  contracted users create [OPTIONS]

DESCRIPTION:
  Create a new user account

OPTIONS:
  --name <string>     (required) User's display name
  --email <string>    (required) User's email address
  --age <number>      User's age
  --active            Set user as active (default: true)

EXAMPLES:
  contracted users create --name "Alice" --email "alice@example.com"
  contracted users create --name "Bob" --email "bob@example.com" --age 30
```

### Help Generator

```typescript
function generateHelp(node: CommandNode, contract?: EndpointContract): string {
  const lines: string[] = [];

  // USAGE
  lines.push("USAGE:");
  lines.push(`  contracted ${buildUsageLine(node, contract)}`);
  lines.push("");

  // DESCRIPTION
  if (contract?.description) {
    lines.push("DESCRIPTION:");
    lines.push(`  ${contract.description}`);
    lines.push("");
  }

  // OPTIONS
  if (contract?.request) {
    const args = schemaToArgs(contract.request);
    if (args.length > 0) {
      lines.push("OPTIONS:");
      for (const arg of args) {
        const reqMark = arg.required ? "(required) " : "";
        const defaultMark = arg.default !== undefined
          ? ` (default: ${arg.default})`
          : "";
        lines.push(`  ${arg.flag.padEnd(20)} ${reqMark}${arg.description ?? ""}${defaultMark}`);
      }
      lines.push("");
    }
  }

  // EXAMPLES
  if (contract?.examples?.length) {
    lines.push("EXAMPLES:");
    for (const example of contract.examples) {
      lines.push(`  ${example}`);
    }
  }

  return lines.join("\n");
}
```

## Shell Completion

### Bash Completion Script

```bash
_contracted_completions() {
  local cur="${COMP_WORDS[COMP_CWORD]}"
  local prev="${COMP_WORDS[COMP_CWORD-1]}"

  # Top-level commands
  if [[ ${COMP_CWORD} -eq 1 ]]; then
    COMPREPLY=($(compgen -W "users posts comments" -- "$cur"))
    return
  fi

  # Subcommands based on previous word
  case "$prev" in
    users)
      COMPREPLY=($(compgen -W "list create get update delete" -- "$cur"))
      ;;
    # ... more cases
  esac
}

complete -F _contracted_completions contracted
```

### Zsh Completion Script

```zsh
#compdef contracted

_contracted() {
  local -a commands
  commands=(
    'users:User management'
    'posts:Post management'
    'comments:Comment management'
  )

  _describe 'command' commands
}

_contracted "$@"
```

## CLI Framework Comparison

### Cliffy (Deno)

Pros:
- Native Deno support
- TypeScript-first
- Rich feature set (commands, prompts, tables)
- Active development

```typescript
import { Command } from "@cliffy/command";

await new Command()
  .name("contracted")
  .command("users", new Command()
    .command("list", "List users")
    .action(() => { /* ... */ })
  )
  .parse(Deno.args);
```

### Commander (Node)

Pros:
- Most popular Node CLI framework
- Extensive documentation
- Wide ecosystem

```typescript
import { program } from "commander";

program
  .name("contracted")
  .version("1.0.0");

program
  .command("users")
  .command("list")
  .action(() => { /* ... */ });

program.parse();
```

### Recommendation

Use **Cliffy** for Deno-first development. It provides:
- Native TypeScript types
- Built-in table rendering
- Prompt utilities for interactive mode
- Completion script generation

## Error Handling

### User-Friendly Error Messages

```typescript
class CLIError extends Error {
  constructor(
    message: string,
    public readonly exitCode: number = 1,
    public readonly hint?: string
  ) {
    super(message);
    this.name = "CLIError";
  }

  format(): string {
    let output = `Error: ${this.message}`;
    if (this.hint) {
      output += `\n\nHint: ${this.hint}`;
    }
    return output;
  }
}

// Usage
throw new CLIError(
  "Missing required argument: --name",
  2,
  "Use --help to see available options"
);
```

### Exit Code Mapping

| Code | Meaning | Example |
|------|---------|---------|
| 0 | Success | Command completed |
| 1 | General error | Network failure |
| 2 | Validation error | Missing required arg |
| 3 | Config error | Invalid config file |
| 4 | Auth error | Unauthorized (401) |
| 5 | Not found | Resource not found (404) |
