# Epic: client - Research

## Reference Implementation Analysis

Source: `C:\Users\smart\Documents\Repos\Claude-Browser-Control-Deno\src\orchestrator\client\client.ts`

### Client Class Architecture

The reference Client class (~137 lines) implements a hierarchical URL composition pattern with HTTP method helpers.

#### Core Properties

```typescript
export class Client implements HasUrl {
  #url?: string;        // Direct URL (when constructed with string)
  #parent?: HasUrl;     // Parent client (when constructed with HasUrl)
  #path?: string;       // Path segment relative to parent

  constructor(url: string | HasUrl, path?: string) {
    if (typeof url === "string") {
      this.#url = url;
    } else {
      this.#parent = url;
      this.#path = path ?? "";
    }
  }
}
```

Key design decisions:
- Private fields (`#url`, `#parent`, `#path`) prevent external mutation
- Constructor overloading via union type `string | HasUrl`
- Empty string default for path enables root-relative children

#### URL Composition

```typescript
get url(): string {
  if (this.#url) return this.#url;
  const parentUrl = this.#parent!.url;
  const base = parentUrl.endsWith("/") ? parentUrl : parentUrl + "/";
  return this.#path ? new URL(this.#path, base).href : parentUrl;
}
```

Resolution rules:
1. If direct URL set, return it
2. Otherwise, compose from parent URL + path
3. Trailing slash normalization ensures consistent joining
4. Uses `URL` constructor for proper path resolution

#### Path Tracking

```typescript
get path(): string {
  if (this.#parent?.path)
    return [this.#parent.path, this.#path].filter(Boolean).join("/");
  return this.#path ?? "";
}
```

The `path` getter tracks the full path from root, useful for:
- Debug logging
- Contract matching
- Error messages with context

### HTTP Method Patterns

#### Simple Methods (No Body)

For GET, HEAD, DELETE:

```typescript
async simple(
  method: Method,
  path?: string,
  specificCode?: number
): Promise<unknown> {
  const response = await fetch(
    this.#full(path),
    { method }
  );
  const ok = response.ok && (specificCode ? response.status === specificCode : true);
  if (!ok) {
    throw new ResponseError(
      response.statusText,
      response.status
    );
  }
  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}
```

Design notes:
- `#full(path)` composes final URL
- Optional `specificCode` for strict status validation
- Empty response body handled gracefully (`text ? JSON.parse : undefined`)
- Uses `response.text()` not `response.json()` to handle empty bodies

#### Complex Methods (With Body)

For POST, PUT, PATCH:

```typescript
async complex(
  method: Method,
  pathOrBody?: string | unknown,
  maybeBody?: unknown,
  specificCode?: number
): Promise<unknown> {
  const path = typeof pathOrBody === "string" ? pathOrBody : undefined;
  const body = typeof pathOrBody === "string" ? maybeBody : pathOrBody;
  const response = await fetch(
    this.#full(path),
    {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  // ... error handling
  return response.json();
}
```

Design notes:
- Overloaded to support `complex(method, body)` and `complex(method, path, body)`
- Runtime type check (`typeof pathOrBody === "string"`) disambiguates
- Always sets `Content-Type: application/json`
- Uses `response.json()` (assumes non-empty response)

#### Method Overloads

TypeScript overloads provide ergonomic API:

```typescript
put(body?: unknown): Promise<unknown>;
put(path?: string, body?: unknown): Promise<unknown>;
put(pathOrBody?: string | unknown, maybeBody?: unknown, specificCode?: number): Promise<unknown> {
  return this.complex("PUT", pathOrBody, maybeBody, specificCode);
}
```

Pattern repeats for `post()`, `patch()`.

Simple methods have simpler overloads:

```typescript
get(path?: string, specificCode?: number): Promise<unknown> {
  return this.simple("GET", path, specificCode);
}
```

### Health Check Pattern

```typescript
async alive(path?: string, specificCode?: number): Promise<boolean> {
  try {
    await this.head(path, specificCode);
    return true;
  } catch (error) {
    if (error instanceof ResponseError)
      return false;
    else
      throw error;
  }
}
```

Returns boolean without throwing for HTTP errors, but rethrows network errors.

### Error Handling

The reference reuses `CodedError` from the server module:

```typescript
import { CodedError as ResponseError } from "../server/errors.ts";
```

For the client epic, we should define a standalone `ResponseError`:

```typescript
export class ResponseError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ResponseError";
  }
}
```

Properties:
- `message` - HTTP status text (e.g., "Not Found")
- `status` - HTTP status code (e.g., 404)

## Contract Factory Design

### Integration with Generated Code

The transpiler generates `miniclient()` factories that use `create()`:

```typescript
// Generated: src/api/users/miniclient.ts
import { create } from "@contracted/client";
import { listContract, createContract } from "./contracts.ts";

export const miniclient = (client: Client) => ({
  list: create(listContract, client),
  create: create(createContract, client),
});
```

### Factory Implementation

```typescript
export function create<TReq, TRes>(
  contract: EndpointContract<TReq, TRes>,
  client: Client
): (request?: TReq) => Promise<TRes> {
  const method = contract.method.toUpperCase();
  const path = contract.path;

  if (["GET", "HEAD", "DELETE"].includes(method)) {
    return async (request?: TReq) => {
      // Encode request as query params if present
      const url = request ? `${path}?${encodeParams(request)}` : path;
      return client.simple(method, url) as Promise<TRes>;
    };
  } else {
    return async (request?: TReq) => {
      return client.complex(method, path, request) as Promise<TRes>;
    };
  }
}
```

### Type Flow

Contract types flow through the factory:

```
Contract<TReq, TRes>
    |
    v
create(contract, client)
    |
    v
(request?: TReq) => Promise<TRes>
```

## HasUrl Interface

Enables composition with any URL-providing object:

```typescript
export interface HasUrl {
  url: string;
  path?: string;
}
```

Use cases:
- Client-to-client nesting
- Integration with external URL providers
- Testing with mock URL sources

## Potential Improvements

### 1. Timeout Configuration

```typescript
interface ClientConfig {
  timeout?: number;
  signal?: AbortSignal;
}

constructor(url: string | HasUrl, path?: string, config?: ClientConfig) {
  // ...
}
```

### 2. Retry Logic

```typescript
interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryOn?: number[]; // Status codes to retry
}
```

### 3. Request/Response Interceptors

```typescript
type Interceptor = (request: Request) => Request | Promise<Request>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

class Client {
  use(interceptor: Interceptor): this;
  useResponse(interceptor: ResponseInterceptor): this;
}
```

### 4. AbortController Support

```typescript
// Per-request cancellation
await client.get("/users", { signal: controller.signal });

// Client-level abort
client.abort(); // Cancels all pending requests
```

### 5. Base Headers

```typescript
class Client {
  #headers: Headers = new Headers();

  setHeader(name: string, value: string): this {
    this.#headers.set(name, value);
    return this;
  }
}
```

## Query Parameter Encoding

For GET requests with request data:

```typescript
function encodeParams(obj: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      params.set(key, typeof value === "object"
        ? JSON.stringify(value)
        : String(value));
    }
  }
  return params.toString();
}
```

Special handling for:
- Objects/arrays -> JSON strings
- undefined -> omitted
- null/primitives -> String()

## Testing Considerations

### Mock Client

```typescript
class MockClient implements HasUrl {
  url = "http://mock";
  responses: Map<string, unknown> = new Map();

  setResponse(path: string, data: unknown): this {
    this.responses.set(path, data);
    return this;
  }

  async get(path?: string): Promise<unknown> {
    return this.responses.get(path ?? "/");
  }
}
```

### Fetch Mocking

Use native `globalThis.fetch` mocking or libraries like `msw`:

```typescript
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const server = setupServer(
  http.get("http://localhost:3000/users", () => {
    return HttpResponse.json([{ id: 1, name: "Alice" }]);
  })
);
```

## Platform Compatibility

The client uses only standard APIs:
- `fetch()` - Available in Deno, Node 18+, browsers
- `URL` - Universal
- `Headers`, `Request`, `Response` - Standard fetch types

No platform-specific code required.
