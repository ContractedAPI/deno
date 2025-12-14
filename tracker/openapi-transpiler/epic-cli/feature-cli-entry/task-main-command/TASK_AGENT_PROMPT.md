# Task: main-command - Agent Prompt

> **Branch**: `openapi-transpiler/epic-cli/feature-cli-entry/task-main-command/task`

## Implementation
```typescript
import { Command } from 'cliffy/command';
import type { Contract } from '../types/core.ts';

export function createCli(contracts: Contract[], version: string): Command {
  const cli = new Command()
    .name('api')
    .version(version)
    .description('Generated CLI for ContractedAPI specification')
    .globalOption('-u, --base-url <url:string>', 'Base URL for API', { required: true })
    .globalOption('-c, --config <file:string>', 'Config file path')
    .globalOption('-o, --output <format:string>', 'Output format', { default: 'json' })
    .globalOption('-v, --verbose', 'Verbose output')
    .globalOption('--no-color', 'Disable colors');

  const tree = buildCommandTree(contracts);
  registerCommands(cli, tree);

  return cli;
}

function registerCommands(parent: Command, tree: CommandTree): void {
  for (const [name, node] of tree.root) {
    const cmd = new Command().name(name).description(node.description || '');
    if (node.contract) {
      cmd.action(async (options) => {
        // Execute contract
      });
    }
    for (const child of node.children.values()) {
      registerCommands(cmd, { root: new Map([[child.name, child]]) });
    }
    parent.command(name, cmd);
  }
}
```

## Commit
`feat: add main CLI entry point`
