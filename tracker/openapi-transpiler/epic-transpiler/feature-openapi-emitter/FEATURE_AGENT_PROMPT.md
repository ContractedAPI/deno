# Feature: openapi-emitter - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicTranspiler.FeatureOpenapiEmitter`
> **Root Project Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno`
> **Branch**: `openapi-transpiler/epic-transpiler/feature-openapi-emitter/feature`

## Context

You are implementing OpenAPI 3.x document generation from ContractedAPI specifications. This generates OpenAPI output for compatibility with standard tooling. Note: ContractedAPI is derived from but NOT compatible with OpenAPI - this is a one-way conversion.

## Your Role

Implement the OpenAPI emitter:
1. Generate valid OpenAPI 3.x documents
2. Consolidate contracts into paths
3. Map contract schemas to OpenAPI format
4. Support both YAML and JSON output

## Prerequisites

- feature-namespace-builder (must be complete)
- epic-loader (must be complete)

## File Structure Target

```
src/transpiler/
├── emit/
│   ├── openapi.ts      # Main OpenAPI emitter
│   ├── paths.ts        # Paths object generation
│   ├── operations.ts   # Operation object generation
│   └── components.ts   # Components extraction
└── types.ts            # OpenAPIEmitterOptions
```

## Implementation Guide

### Options

```typescript
export interface OpenAPIEmitterOptions {
  format: "yaml" | "json";
  version: "3.0.3" | "3.1.0";
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{ url: string; description?: string }>;
}
```

### Document Structure

```typescript
interface OpenAPIDocument {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObject;
  components?: ComponentsObject;
}
```

### Path Consolidation

```typescript
function groupContractsByPath(contracts: Contract[]): Map<string, Contract[]> {
  const groups = new Map<string, Contract[]>();

  for (const contract of contracts) {
    const existing = groups.get(contract.path) ?? [];
    existing.push(contract);
    groups.set(contract.path, existing);
  }

  return groups;
}
```

### Paths Generation

```typescript
function emitPaths(contracts: Contract[]): PathsObject {
  const groups = groupContractsByPath(contracts);
  const paths: PathsObject = {};

  for (const [path, pathContracts] of groups) {
    paths[path] = {};

    for (const contract of pathContracts) {
      const method = contract.method.toLowerCase();
      paths[path][method] = emitOperation(contract);
    }
  }

  return paths;
}
```

### Operation Generation

```typescript
function emitOperation(contract: Contract): OperationObject {
  const operation: OperationObject = {
    operationId: contract.name,
    tags: [deriveTag(contract)],
    summary: contract.description,
    responses: emitResponses(contract),
  };

  if (contract.request) {
    operation.requestBody = emitRequestBody(contract);
  }

  // Add path parameters
  const pathParams = extractPathParams(contract.path);
  if (pathParams.length > 0) {
    operation.parameters = pathParams.map(param => ({
      name: param,
      in: "path",
      required: true,
      schema: { type: "string" },
    }));
  }

  return operation;
}
```

### Request Body

```typescript
function emitRequestBody(contract: Contract): RequestBodyObject {
  return {
    required: true,
    content: {
      "application/json": {
        schema: contract.request,
      },
    },
  };
}
```

### Responses

```typescript
function emitResponses(contract: Contract): ResponsesObject {
  return {
    "200": {
      description: "Successful response",
      content: {
        "application/json": {
          schema: contract.response,
        },
      },
    },
  };
}
```

### Serialization

```typescript
import { stringify } from "@std/yaml";

function serialize(doc: OpenAPIDocument, format: "yaml" | "json"): string {
  if (format === "yaml") {
    return stringify(doc);
  }
  return JSON.stringify(doc, null, 2);
}
```

## Commit Guidelines

- Conventional commit style (no scopes)
- Micro-commits: ~20 lines ideal, max ~100 lines

## Important Reminders

1. **Stay in your worktree** - Return after viewing external files
2. **Micro-commits only** - Keep commits small and focused
3. **Check the checklist** - Refer to [FEATURE_CHECKLIST.md](./FEATURE_CHECKLIST.md)
4. **Valid OpenAPI** - Output must validate
5. **Path parameters** - Extract from path string
