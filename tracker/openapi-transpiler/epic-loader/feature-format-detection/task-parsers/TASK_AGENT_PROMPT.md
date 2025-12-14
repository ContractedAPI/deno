# Task: parsers - Agent Prompt

> **Branch**: `openapi-transpiler/epic-loader/feature-format-detection/task-parsers/task`

## Implementation

```typescript
import { parse as yamlParse } from "@std/yaml";
import { parse as tomlParse } from "@std/toml";

export function parseYaml(content: string): unknown {
  try {
    return yamlParse(content);
  } catch (error) {
    throw new Error(`YAML parse error: ${error.message}`);
  }
}

export function parseToml(content: string): unknown {
  try {
    return tomlParse(content);
  } catch (error) {
    throw new Error(`TOML parse error: ${error.message}`);
  }
}

export function parseJson(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`JSON parse error: ${error.message}`);
  }
}

export function parse(content: string, format: Format): unknown {
  switch (format) {
    case "yaml": return parseYaml(content);
    case "toml": return parseToml(content);
    case "json": return parseJson(content);
  }
}
```

## Commit

`feat: add format parsers`
