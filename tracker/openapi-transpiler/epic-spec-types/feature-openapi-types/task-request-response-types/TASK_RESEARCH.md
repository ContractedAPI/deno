# Task: request-response-types - Research

## Reference

See [EPIC_RESEARCH.md](../../EPIC_RESEARCH.md) for OpenAPI details.

## Parameter Object

Parameters can be in:
- `path`: Part of URL path (e.g., `/users/{id}`)
- `query`: Query string (e.g., `?limit=10`)
- `header`: HTTP header
- `cookie`: Cookie value

Path parameters are always required.

## Security Schemes

OpenAPI supports:
- `apiKey`: API key in header, query, or cookie
- `http`: HTTP authentication (Basic, Bearer, etc.)
- `oauth2`: OAuth 2.0 flows
- `openIdConnect`: OpenID Connect discovery

## Content Types

Request/response bodies use media type keys:
- `application/json`
- `application/xml`
- `multipart/form-data`
- `application/x-www-form-urlencoded`
