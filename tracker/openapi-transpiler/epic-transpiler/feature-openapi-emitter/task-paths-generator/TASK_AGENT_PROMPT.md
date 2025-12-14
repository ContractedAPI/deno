# Task: paths-generator - Agent Prompt

> **Branch**: `openapi-transpiler/epic-transpiler/feature-openapi-emitter/task-paths-generator/task`

## Implementation
```typescript
export function groupContractsByPath(contracts: Contract[]): Map<string, Contract[]> {
  const grouped = new Map<string, Contract[]>();
  for (const contract of contracts) {
    const existing = grouped.get(contract.path) || [];
    existing.push(contract);
    grouped.set(contract.path, existing);
  }
  return grouped;
}

export function emitOperation(contract: Contract): object {
  const op: Record<string, unknown> = {
    operationId: contract.name,
    responses: emitResponses(contract),
  };
  if (contract.request) {
    op.requestBody = emitRequestBody(contract);
  }
  return op;
}

export function emitRequestBody(contract: Contract): object {
  return {
    content: {
      'application/json': { schema: contract.request },
    },
  };
}

export function emitResponses(contract: Contract): object {
  return {
    '200': {
      description: 'Success',
      content: {
        'application/json': { schema: contract.response },
      },
    },
  };
}

export function emitPaths(contracts: Contract[]): object {
  const paths: Record<string, Record<string, unknown>> = {};
  const grouped = groupContractsByPath(contracts);

  for (const [path, pathContracts] of grouped) {
    paths[path] = {};
    for (const contract of pathContracts) {
      paths[path][contract.method.toLowerCase()] = emitOperation(contract);
    }
  }
  return paths;
}
```

## Commit
`feat: add OpenAPI paths generator`
