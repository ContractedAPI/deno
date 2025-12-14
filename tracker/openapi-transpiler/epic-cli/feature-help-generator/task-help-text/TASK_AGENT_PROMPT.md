# Task: help-text - Agent Prompt

> **Branch**: `openapi-transpiler/epic-cli/feature-help-generator/task-help-text/task`

## Implementation
```typescript
export function generateParameterHelp(params: ParameterHelp[]): string {
  return params.map(p => {
    const req = p.required ? '(required)' : '(optional)';
    const def = p.default ? ` [default: ${p.default}]` : '';
    return `  --${p.name} <${p.type}> ${req}${def}\n    ${p.description || ''}`;
  }).join('\n');
}

export function generateHelp(command: CommandNode, options: HelpOptions): string {
  const lines: string[] = [];
  lines.push(`Usage: ${options.programName} ${command.name} [options]`);
  lines.push('');
  if (command.description) {
    lines.push(command.description);
    lines.push('');
  }
  lines.push('Options:');
  if (command.contract?.request) {
    const args = schemaToArgs(command.contract.request);
    lines.push(generateParameterHelp(args.map(a => ({
      name: a.name,
      type: a.type,
      required: a.required,
      description: a.description,
      default: String(a.default ?? ''),
    }))));
  }
  return lines.join('\n');
}
```

## Commit
`feat: add help text generation`
