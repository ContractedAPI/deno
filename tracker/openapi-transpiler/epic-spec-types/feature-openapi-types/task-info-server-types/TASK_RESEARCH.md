# Task: info-server-types - Research

## Reference

See [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for OpenAPI 3.1 specification details.

## OpenAPI 3.1 Info Object

From the OpenAPI specification:
- `title` (required): API name
- `version` (required): API version (not OpenAPI version)
- `description`: Markdown-supported description
- `termsOfService`: URL to terms
- `contact`: Contact information
- `license`: License information

## Server Variables

Server URLs can include variables:
```yaml
servers:
  - url: https://{environment}.api.example.com/v{version}
    variables:
      environment:
        default: production
        enum: [production, staging, development]
      version:
        default: "1"
```
