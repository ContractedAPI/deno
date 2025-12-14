# Epic: cli - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicCli`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-cli/epic`

## Context

You are working on CLI generation from ContractedAPI specifications. The CLI epic transforms contract paths and schemas into a user-friendly command-line interface.

The CLI epic is an **end-user facing component** that depends on the client epic for HTTP communication.

## Your Role at Epic Level

At the epic level, your responsibilities are:
1. Set up the CLI entry point and framework integration
2. Establish the command tree generation pattern
3. Design the argument parsing system
4. Create output formatting infrastructure

**Individual features are implemented by dedicated feature-level agents.**

## Prerequisites

This epic depends on:
- **epic-spec-types** (must be complete) - Contract type definitions
- **epic-loader** (must be complete) - Load specifications for command generation
- **epic-transpiler** (must be complete) - Generated types for type-safe commands
- **epic-client** (must be complete) - HTTP client for command execution

## Reference Project

The reference project at `C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator` does not include a CLI module. Design based on the contract structure and standard CLI patterns.

**Remember**: After viewing reference files, return to your worktree.

## File Structure Target

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

## Key Patterns

### Command Tree Structure

Transform contract paths into hierarchical commands:

```typescript
// Contract paths:
// GET /users -> operationId: "listUsers"
// POST /users -> operationId: "createUser"
// GET /users/{id} -> operationId: "getUser"
// DELETE /users/{id} -> operationId: "deleteUser"

// Command structure:
// contracted users list
// contracted users create --name "Alice"
// contracted users get <id>
// contracted users delete <id>
```

### Path Parameter Extraction

```typescript
// /users/{userId}/posts/{postId}
// Path segments: ["users", "{userId}", "posts", "{postId}"]
// Static segments -> command groups
// Dynamic segments -> positional arguments

// Result:
// contracted users <userId> posts <postId> <operation>
```

### Schema to Argument Mapping

```typescript
interface ArgumentMapping {
  // Path parameters become positional
  positional: Array<{
    name: string;
    type: string;
    required: true;
  }>;

  // Query/body parameters become options
  options: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: unknown;
    description?: string;
  }>;
}

function mapSchemaToArgs(contract: EndpointContract): ArgumentMapping {
  // Extract path params from contract.path
  // Extract body/query params from contract.request schema
}
```

### Type Coercion

```typescript
function coerce(value: string, type: string): unknown {
  switch (type) {
    case "integer":
    case "number":
      return Number(value);
    case "boolean":
      return value === "true" || value === "1";
    case "array":
      return value.split(",");
    case "object":
      return JSON.parse(value);
    default:
      return value;
  }
}
```

### Output Formatting

```typescript
interface OutputFormatter {
  format(data: unknown): string;
}

const formatters: Record<string, OutputFormatter> = {
  json: { format: (d) => JSON.stringify(d, null, 2) },
  table: { format: (d) => formatTable(d) },
  plain: { format: (d) => formatPlain(d) },
};
```

### Configuration Loading

```typescript
interface CLIConfig {
  baseUrl?: string;
  format?: "json" | "table" | "plain";
  verbose?: boolean;
  timeout?: number;
}

// Load order (later overrides earlier):
// 1. Built-in defaults
// 2. .contractedrc in home directory
// 3. .contractedrc in current directory
// 4. Environment variables (CONTRACTED_*)
// 5. Command-line arguments
```

### Exit Codes

```typescript
const EXIT_SUCCESS = 0;       // Command completed successfully
const EXIT_ERROR = 1;         // Runtime error (network, server)
const EXIT_VALIDATION = 2;    // Input validation error
const EXIT_CONFIG = 3;        // Configuration error
```

## CLI Framework Recommendation

**Cliffy** (for Deno) or **Commander** (for Node) are recommended:

```typescript
// Cliffy example (Deno)
import { Command } from "@cliffy/command";

const cmd = new Command()
  .name("contracted")
  .version("1.0.0")
  .description("ContractedAPI CLI")
  .globalOption("-u, --base-url <url>", "Base URL")
  .globalOption("-f, --format <format>", "Output format", { default: "json" });

// Add generated commands
for (const contract of contracts) {
  addCommand(cmd, contract);
}

await cmd.parse(Deno.args);
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines
- Format: `type: description` (feat, fix, docs, refactor, chore)

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Don't implement features** - Focus on epic-level coordination
4. **Check the checklist** - Refer to [EPIC_CHECKLIST.md](./EPIC_CHECKLIST.md)
5. **Study contract structure** - Understand how paths and schemas map to commands
6. **Consider UX** - CLI should be intuitive and provide helpful error messages
