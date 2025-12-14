# Feature: typescript-emitter - Research

## Reference Output (contracts/api.ts)

From the reference project (~1990 lines):

### File Structure

```
Lines 1-15:    Imports and type imports
Lines 16-1593: Contracts array (30 contracts with inline schemas)
Lines 1595-1651: Base type exports
Lines 1653-1989: Namespaced types and utilities
```

### Imports Section

```typescript
import type { FromSchema } from "json-schema-to-ts";
import type { ContractByName } from "./types.ts";
import { create } from "../client/create.ts";
```

### Contracts Array Pattern

```typescript
export const contracts = [
  {
    name: "root:health",
    path: "/",
    method: "HEAD",
    module: "./root/health.ts",
    request: {
      type: "object",
      properties: {},
      required: [],
    } as const,
    response: {
      type: "null",
    } as const,
  },
  // ... more contracts
] as const;
```

Key patterns:
- Each property uses `as const` for literal types
- Outer array uses `as const`
- Inline JSON schemas (not refs)

### Base Types

```typescript
export type Contracts = typeof contracts;
export type Contract = Contracts[number];
export type ContractName = Contract["name"];
```

### Namespace Pattern

```typescript
export namespace Root {
  // === Contract Types ===
  export type HealthContract = ContractByName<Contracts, "root:health">;
  export type ListContract = ContractByName<Contracts, "root:list">;
  export type KillAllContract = ContractByName<Contracts, "root:killAll">;

  // === Response Types ===
  export type HealthResponse = FromSchema<HealthContract["response"]>;
  export type ListResponse = FromSchema<ListContract["response"]>;
  export type KillAllResponse = FromSchema<KillAllContract["response"]>;

  // === Contract Instances ===
  export const health = contracts.find(c => c.name === "root:health")!;
  export const list = contracts.find(c => c.name === "root:list")!;
  export const killAll = contracts.find(c => c.name === "root:killAll")!;

  // === Client Factory ===
  export const miniclient = () => ({
    health: create(health),
    list: create(list),
    killAll: create(killAll),
  });

  // === Binding Types ===
  export type Binding<T> = {
    "root:health": T;
    "root:list": T;
    "root:killAll": T;
  };

  export type MiniBinding<T> = {
    health: T;
    list: T;
    killAll: T;
  };

  export type FullBinding<T> = {
    Root: MiniBinding<T>;
  };

  // === Assertion Types ===
  export type AssertBinding<T extends Binding<unknown>> = T;
  export type AssertMiniBinding<T extends MiniBinding<unknown>> = T;
  export type AssertFullBinding<T extends FullBinding<unknown>> = T;
}
```

### Combined Types

```typescript
export type IContractCLI<T> =
  Root.Binding<T> &
  Endpoint.Binding<T> &
  Context.Binding<T> &
  Target.Binding<T> &
  Node.Binding<T>;

export type IContractMCP<T> = IContractCLI<T>;
```

## String Generation Patterns

### Schema Emission

```typescript
function emitSchema(schema: JSONSchema): string {
  return JSON.stringify(schema, null, 2)
    .replace(/"(\w+)":/g, "$1:");  // Remove quotes from property names
}

// Or for more control:
function emitSchemaFormatted(schema: JSONSchema, indent: string): string {
  // Custom formatting that produces cleaner output
}
```

### Name Derivation

```typescript
function getContractTypeName(contract: Contract): string {
  // "users:list" → "List"
  // "users:create" → "Create"
  const action = contract.name.split(":").pop()!;
  return toPascalCase(action);
}

function getContractInstanceName(contract: Contract): string {
  // "users:list" → "list"
  // "users:createNew" → "createNew"
  return contract.name.split(":").pop()!;
}
```

### Binding Entry Generation

```typescript
function emitBindingEntry(contract: Contract): string {
  return `"${contract.name}": T;`;
}

function emitMiniBindingEntry(contract: Contract): string {
  const name = getContractInstanceName(contract);
  return `${name}: T;`;
}
```

## Formatting Considerations

### Indentation

```typescript
class CodeBuilder {
  private lines: string[] = [];
  private indentLevel = 0;
  private indentStr: string;

  constructor(indent: string = "  ") {
    this.indentStr = indent;
  }

  line(content: string): this {
    this.lines.push(this.currentIndent + content);
    return this;
  }

  indent(): this {
    this.indentLevel++;
    return this;
  }

  dedent(): this {
    this.indentLevel--;
    return this;
  }

  private get currentIndent(): string {
    return this.indentStr.repeat(this.indentLevel);
  }

  toString(): string {
    return this.lines.join("\n");
  }
}
```

### Line Length

For long schemas, consider:
- Multi-line object formatting
- Consistent indentation
- Prettier compatibility

## Edge Cases

### Contracts Without Request

```typescript
// Only emit response type
export type HealthContract = ContractByName<Contracts, "root:health">;
export type HealthResponse = FromSchema<HealthContract["response"]>;
// NO HealthRequest type
```

### Empty Namespaces

Skip namespaces with no contracts:
```typescript
if (node.contracts.length === 0) {
  return "";  // Don't emit empty namespace
}
```

### Reserved Words

Avoid conflicts with TypeScript reserved words:
```typescript
const RESERVED = new Set(["default", "class", "function", ...]);

function safeIdentifier(name: string): string {
  if (RESERVED.has(name)) {
    return `_${name}`;
  }
  return name;
}
```

### Special Characters in Names

Contract names may contain characters invalid in TypeScript:
```typescript
// "users:create-new" → "createNew"
function sanitizeName(name: string): string {
  return name.replace(/-/g, "");
}
```

## Testing Strategy

Test cases:
1. Simple contract emission
2. Contract with request and response
3. Contract without request
4. Namespace with multiple contracts
5. Nested namespaces
6. Empty namespace (should skip)
7. Special characters in names
8. Large specification (performance)
9. Output compiles with TypeScript
10. Generated types work with FromSchema
