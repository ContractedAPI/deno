# Feature: cli-entry - Agent Prompt

> **Worktree Location**: `C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\OpenapiTranspiler.EpicCli.FeatureCliEntry`
> **Branch**: `openapi-transpiler/epic-cli/feature-cli-entry/feature`

## Context

Implement the main CLI entry point using Cliffy framework.

## Key Implementation

```typescript
import { Command } from "@cliffy/command";

const cmd = new Command()
  .name("contracted")
  .version("1.0.0")
  .description("ContractedAPI CLI")
  .globalOption("-u, --base-url <url>", "Base URL")
  .globalOption("-f, --format <format>", "Output format", { default: "json" });

await cmd.parse(Deno.args);
```
