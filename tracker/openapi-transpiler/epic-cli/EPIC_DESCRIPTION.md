# Epic: cli

## Overview

Implement CLI generation from ContractedAPI specifications. The CLI epic provides:
1. **Command structure** - Hierarchical commands from contract paths
2. **Argument parsing** - Type-safe arguments from request schemas
3. **Output formatting** - JSON, table, and plain text outputs
4. **Help generation** - Auto-generated from contract descriptions

The CLI consumes the client epic for HTTP communication and generates a user-facing command-line interface.

## Key Deliverables

### feature-cli-entry
- Main entry point (`contracted` command)
- Global options (--base-url, --format, --verbose)
- Configuration loading (.contractedrc)
- Version and help commands
- Error handling and exit codes

### feature-command-tree
- Hierarchical command structure from paths
- `/users` -> `contracted users`
- `/users/{id}` -> `contracted users <id>`
- Contract operationId -> subcommand names
- Group contracts by path prefix

### feature-argument-parser
- Request schema to CLI argument mapping
- Required vs optional arguments
- Type coercion (string -> number, boolean, JSON)
- Path parameters as positional arguments
- Query/body parameters as options
- JSON file input support (--data @file.json)

### feature-output-formatter
- JSON output (--format json)
- Table output (--format table)
- Plain text output (--format plain)
- Streaming response support
- Color and formatting options
- Quiet mode (--quiet)

### feature-help-generator
- Command descriptions from contract.description
- Parameter help from schema.description
- Examples generation
- Man page generation (optional)
- Bash/Zsh completion scripts

## File Structure

```
src/cli/
├── mod.ts              # Public exports
├── main.ts             # Entry point (contracted command)
├── commands/
│   ├── generate.ts     # Command tree generation
│   └── execute.ts      # Command execution
├── parser/
│   ├── args.ts         # Argument parsing
│   └── coerce.ts       # Type coercion
├── output/
│   ├── json.ts         # JSON formatter
│   ├── table.ts        # Table formatter
│   └── plain.ts        # Plain text formatter
├── config.ts           # Configuration loading
├── help.ts             # Help generation
└── types.ts            # CLI types
```

## Dependencies

### External
- **Cliffy** or **Commander** - CLI framework
- **cli-table3** or similar - Table rendering
- **chalk** or **picocolors** - Terminal colors

### Internal
- **epic-spec-types** (must be complete)
  - Contract type definitions
  - JSON Schema types
- **epic-loader** (must be complete)
  - Load specifications for command generation
- **epic-transpiler** (must be complete)
  - Generated types for type-safe commands
- **epic-client** (must be complete)
  - HTTP client for command execution

## Dependents

- None (end-user facing component)

## Key Patterns

### Command Tree Generation

```typescript
// From contracts:
// GET /users -> "list" operation
// POST /users -> "create" operation
// GET /users/{id} -> "get" operation
// DELETE /users/{id} -> "delete" operation

// Generated commands:
// contracted users list
// contracted users create --name "Alice"
// contracted users get <id>
// contracted users delete <id>
```

### Path Parameter Handling

```typescript
// /users/{userId}/posts/{postId}
// becomes:
// contracted users <userId> posts <postId> get

// Path parameters are positional
// Body/query parameters are options
```

### Schema to Argument Mapping

```typescript
// Request schema:
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "description": "User name" },
    "age": { "type": "integer", "description": "User age" },
    "active": { "type": "boolean", "default": true }
  },
  "required": ["name"]
}

// Becomes:
// --name <string> (required)
// --age <number> (optional)
// --active (boolean flag, default: true)
```

### Output Formatting

```typescript
// JSON (default for scripting)
contracted users list --format json
// [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]

// Table (default for interactive)
contracted users list --format table
// +----+-------+
// | ID | Name  |
// +----+-------+
// | 1  | Alice |
// | 2  | Bob   |
// +----+-------+

// Plain (minimal)
contracted users list --format plain
// Alice
// Bob
```
