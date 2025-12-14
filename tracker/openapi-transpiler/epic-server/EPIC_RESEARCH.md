# Epic: server - Research

## Reference Files

From reference project `Claude-Browser-Control-Deno/src/orchestrator/server/`:

| File | ~Lines | Purpose |
|------|--------|---------|
| `builder.ts` | 319 | Route building, **BuildPhase pattern** |
| `serve.ts` | 50 | HTTP server lifecycle management |
| `errors.ts` | 26 | Error classes |
| `registry.ts` | 44 | Instance tracking singleton |
| `types.ts` | 44 | ServerConfig, Instance types |

---

## BuildPhase Pattern (CRITICAL)

The `BuildPhase` pattern from `server/builder.ts` is a **lazy dependency resolution system** that enables parallel building of independent route segments. This pattern was essential in the reference implementation and should be ported AND improved.

### What It Is

`BuildPhase<T>` is a Promise-like class that:
1. Wraps an asynchronous job (build step)
2. Tracks dependencies on other BuildPhases
3. Only executes when explicitly triggered via `run()`
4. Waits for all dependencies to complete before executing its own job
5. Enables parallel execution of independent build steps

### Why It Matters

When building a route tree from contracts:
- Each path segment can be built independently
- Child routes depend on parent route initialization
- Handler compilation can happen in parallel with route setup
- The dependency graph naturally emerges from the build structure

Without this pattern, you'd either:
- Build sequentially (slow)
- Manually orchestrate parallelism (complex, error-prone)

### Original Implementation

```typescript
class BuildPhase<T> implements PromiseLike<T> {
  #run: (phase: BuildPhase<T>) => Promise<void> | void;
  // deno-lint-ignore no-explicit-any
  #dependencies: BuildPhase<any>[] = [];
  #promise: Promise<T>;
  complete!: (value: T | PromiseLike<T>) => void;
  fail!: (reason?: unknown) => void;

  constructor(job: (phase: BuildPhase<T>) => Promise<void> | void) {
    this.#promise = new Promise<T>((resolve, reject) => {
      this.complete = resolve;
      this.fail = reject;
    });
    this.#run = job;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.#promise.then(onfulfilled, onrejected);
  }

  #inprogress?: Promise<void>;
  run(): this {
    if (!this.#inprogress) {
      this.#inprogress = Promise.all(
        this.#dependencies.map((dep) => dep.run())
      ).then(() => this.#run(this)).catch((err) => this.fail(err));
    }
    return this;
  }

  // deno-lint-ignore no-explicit-any
  depends(...phases: BuildPhase<any>[]): this {
    this.#dependencies.push(...phases);
    return this;
  }
}
```

### How It Works

#### 1. Construction
```typescript
const phase = new BuildPhase<ResultType>((phase) => {
  // This job runs AFTER dependencies complete
  // Call phase.complete(value) when done
  // Call phase.fail(error) on failure
});
```

The constructor:
- Creates an internal Promise that will hold the result
- Exposes `complete` and `fail` methods to resolve/reject
- Stores the job function for later execution

#### 2. Dependency Declaration
```typescript
phase.depends(otherPhase1, otherPhase2);
```

- Dependencies are tracked in an array
- Fluent API allows chaining: `phase.depends(a, b).depends(c)`
- Dependencies can be added before `run()` is called

#### 3. Execution
```typescript
phase.run();
```

When `run()` is called:
1. If already in progress, returns immediately (idempotent)
2. Recursively calls `run()` on all dependencies
3. Waits for ALL dependencies via `Promise.all()`
4. Only then executes the job function
5. Errors propagate to `fail()`

#### 4. Awaiting Results
```typescript
const result = await phase;  // Works because PromiseLike
// or
phase.then((result) => { ... });
```

The `PromiseLike` interface allows natural async/await usage.

### Usage in RouteBuilder

The reference implementation uses BuildPhase for multi-stage route construction:

```typescript
class RouteBuilder {
  // Helper to create phases
  #phase<T>(job: (phase: BuildPhase<T>) => Promise<void> | void): BuildPhase<T> {
    return new BuildPhase<T>(job);
  }

  // Helper for immediate values
  #instant<T>(value: T): BuildPhase<T> {
    return this.#phase((phase) => phase.complete(value));
  }

  // Memoized build phases
  #_init?: BuildPhase<Hono>;
  #init(): BuildPhase<Hono> {
    return this.#_init ??= this.#instant(new Hono());
  }

  #_handlers?: BuildPhase<HandlerMap>;
  #handlers(): BuildPhase<HandlerMap> {
    return this.#_handlers ??= this.#phase<HandlerMap>((phase) => {
      // Compile handlers from contracts
      phase.complete(handlers);
    });
  }

  #_setup?: BuildPhase<void>;
  #setup(): BuildPhase<void> {
    const init = this.#init();
    const handlers = this.#handlers();

    return this.#_setup ??= this
      .#phase<void>(async (phase) => {
        const endpoint = await init;
        const handler_map = await handlers;
        // Register routes...
        phase.complete();
      })
      .depends(init, handlers);  // Explicit dependencies
  }

  #_children?: BuildPhase<void>;
  #children(): BuildPhase<void> {
    const children = Array.from(this.values()).map(
      (child) => child.build()
    );
    const init = this.#init();

    return this.#_children ??= this.#phase<void>(async (phase) => {
      const endpoint = await init;
      for await (const child of children) {
        endpoint.route(`/${child.segment}`, child.router!);
      }
      phase.complete();
    }).depends(...children, init);  // Depends on ALL children
  }

  build(): BuildPhase<this> {
    const setup = this.#setup();
    const children = this.#children();
    const init = this.#init();

    return this.#_final ??= this.#phase<this>(async (phase) => {
      this.router = await init;
      phase.complete(this);
    }).depends(setup, children, init);
  }
}
```

### Dependency Graph Example

For a route tree like `/api/users/{id}`:

```
build() ─────────────────────────────────────────┐
  │                                              │
  ├── depends on: setup() ───────────────────────┤
  │     │                                        │
  │     ├── depends on: init() ──────────────────┤
  │     │     └── (instant: new Hono())          │
  │     │                                        │
  │     └── depends on: handlers() ──────────────┤
  │           └── (compiles contract handlers)   │
  │                                              │
  └── depends on: children() ────────────────────┤
        │                                        │
        ├── depends on: init() (same instance)   │
        │                                        │
        └── depends on: child.build() ───────────┘
              └── (recursive for each child)
```

When `build().run()` is called on the root:
1. All leaf nodes start executing in parallel
2. Parent nodes wait for their dependencies
3. The tree resolves bottom-up
4. Memoization prevents duplicate work

---

## RouteBuilder Tree Pattern

The `RouteBuilder` class extends `Map<string, RouteBuilder>` to create a hierarchical tree matching URL path segments. This works in conjunction with BuildPhase for parallel construction.

### Core Structure

```typescript
class RouteBuilder extends Map<string, RouteBuilder> {
  readonly path: string;
  readonly segment: string;
  contracts: EndpointContract[] = [];
  router?: Hono;

  constructor(path: string = "", readonly base?: string) {
    super();
    this.path = path;
    this.segment = path.split("/").filter(Boolean).at(-1) ?? "";
  }

  // Get or create child for path segment
  enforce(segments: string[]): RouteBuilder {
    if (segments.length === 0) return this;

    const [head, ...tail] = segments;
    let child = this.get(head);
    if (!child) {
      child = new RouteBuilder(
        [this.path, head].filter(Boolean).join("/"),
        this.base
      );
      this.set(head, child);
    }
    return child.enforce(tail);
  }

  // Navigate to path
  ensure(path: string): RouteBuilder {
    return this.enforce(path.split("/").filter(Boolean));
  }
}
```

### Tree Structure Example

For contracts with paths `/`, `/api/users`, `/api/users/{id}`, `/api/posts`:

```
RouteBuilder (root, path="")
├── "api" → RouteBuilder (path="/api")
│   ├── "users" → RouteBuilder (path="/api/users")
│   │   └── "{id}" → RouteBuilder (path="/api/users/{id}")
│   └── "posts" → RouteBuilder (path="/api/posts")
```

### Static Build Entry Point

```typescript
static async build(
  contracts: EndpointContract[],
  base?: string
): Promise<Hono> {
  const root = new RouteBuilder("", base);

  // Distribute contracts to appropriate nodes
  for (const contract of contracts)
    root.ensure(contract.path).contracts.push(contract);

  // Build entire tree with BuildPhase parallelism
  return (await root.build().run()).router!;
}
```

### Integration with BuildPhase

Each RouteBuilder node creates BuildPhases that:
1. **init()**: Create Hono instance (instant)
2. **handlers()**: Compile AJV validators, create middleware chain
3. **setup()**: Register routes on Hono instance (depends on init, handlers)
4. **children()**: Recursively build child nodes, mount as subroutes (depends on child.build())
5. **build()**: Final assembly (depends on setup, children, init)

---

## Potential Improvements

The original implementation is solid but has room for enhancement:

### 1. Better Error Propagation

**Current**: Errors are caught and passed to `fail()`, but the source is unclear in deep dependency chains.

**Improvement**: Wrap errors with dependency chain context.

```typescript
class BuildPhaseError extends Error {
  constructor(
    message: string,
    public readonly phase: string,
    public readonly cause?: Error,
    public readonly dependencyChain?: string[]
  ) {
    super(message);
    this.name = 'BuildPhaseError';
  }
}

// In run():
.catch((err) => {
  const wrapped = new BuildPhaseError(
    `Build phase failed: ${this.name}`,
    this.name,
    err instanceof Error ? err : new Error(String(err)),
    this.#dependencyChain
  );
  this.fail(wrapped);
});
```

### 2. Cancellation Support

**Current**: No way to cancel in-flight builds.

**Improvement**: Add AbortController integration.

```typescript
class BuildPhase<T> implements PromiseLike<T> {
  #abortController?: AbortController;

  constructor(
    job: (phase: BuildPhase<T>, signal: AbortSignal) => Promise<void> | void,
    options?: { signal?: AbortSignal }
  ) {
    this.#abortController = new AbortController();
    if (options?.signal) {
      options.signal.addEventListener('abort', () => this.cancel());
    }
    // ...
  }

  cancel(reason?: string): void {
    this.#abortController?.abort(reason);
    this.fail(new CancellationError(reason));
  }

  get signal(): AbortSignal {
    return this.#abortController!.signal;
  }
}
```

### 3. Progress Tracking/Reporting

**Current**: No visibility into build progress.

**Improvement**: Add progress callbacks and state tracking.

```typescript
type BuildState = 'pending' | 'waiting' | 'running' | 'completed' | 'failed';

class BuildPhase<T> {
  #state: BuildState = 'pending';
  #onStateChange?: (state: BuildState, phase: BuildPhase<T>) => void;

  get state(): BuildState { return this.#state; }

  onStateChange(callback: (state: BuildState, phase: BuildPhase<T>) => void): this {
    this.#onStateChange = callback;
    return this;
  }

  #setState(state: BuildState): void {
    this.#state = state;
    this.#onStateChange?.(state, this);
  }

  // In run():
  run(): this {
    if (!this.#inprogress) {
      this.#setState('waiting');
      this.#inprogress = Promise.all(
        this.#dependencies.map((dep) => dep.run())
      ).then(() => {
        this.#setState('running');
        return this.#run(this);
      }).then(() => {
        this.#setState('completed');
      }).catch((err) => {
        this.#setState('failed');
        this.fail(err);
      });
    }
    return this;
  }
}

// Usage: Progress reporting
const phases: BuildPhase<unknown>[] = [];
let completed = 0;

for (const phase of phases) {
  phase.onStateChange((state) => {
    if (state === 'completed') {
      completed++;
      console.log(`Progress: ${completed}/${phases.length}`);
    }
  });
}
```

### 4. Cycle Detection

**Current**: Circular dependencies cause infinite loops or deadlocks.

**Improvement**: Detect cycles at dependency declaration time.

```typescript
class BuildPhase<T> {
  #id: symbol = Symbol();

  depends(...phases: BuildPhase<any>[]): this {
    for (const phase of phases) {
      if (this.#wouldCreateCycle(phase)) {
        throw new Error(
          `Circular dependency detected: adding ${phase.name} to ${this.name}`
        );
      }
      this.#dependencies.push(phase);
    }
    return this;
  }

  #wouldCreateCycle(target: BuildPhase<any>, visited = new Set<symbol>()): boolean {
    if (target.#id === this.#id) return true;
    if (visited.has(target.#id)) return false;

    visited.add(target.#id);
    for (const dep of target.#dependencies) {
      if (this.#wouldCreateCycle(dep, visited)) return true;
    }
    return false;
  }
}
```

### 5. Timeout Handling

**Current**: Stuck dependencies block indefinitely.

**Improvement**: Add configurable timeouts.

```typescript
class BuildPhase<T> {
  #timeout?: number;

  withTimeout(ms: number): this {
    this.#timeout = ms;
    return this;
  }

  run(): this {
    if (!this.#inprogress) {
      const buildPromise = Promise.all(
        this.#dependencies.map((dep) => dep.run())
      ).then(() => this.#run(this));

      if (this.#timeout) {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new TimeoutError(`BuildPhase timed out after ${this.#timeout}ms`));
          }, this.#timeout);
        });

        this.#inprogress = Promise.race([buildPromise, timeoutPromise])
          .catch((err) => this.fail(err));
      } else {
        this.#inprogress = buildPromise.catch((err) => this.fail(err));
      }
    }
    return this;
  }
}

// Usage
const phase = new BuildPhase(async (p) => {
  // ... slow operation
}).withTimeout(5000);
```

### 6. Named Phases for Debugging

**Current**: Phases are anonymous, making debugging difficult.

**Improvement**: Add names and debug output.

```typescript
class BuildPhase<T> {
  readonly name: string;

  constructor(
    name: string,
    job: (phase: BuildPhase<T>) => Promise<void> | void
  ) {
    this.name = name;
    // ...
  }

  debug(): string {
    const deps = this.#dependencies.map(d => d.name).join(', ');
    return `${this.name} [${this.#state}] depends on: [${deps}]`;
  }

  static debugTree(root: BuildPhase<any>, indent = 0): string {
    const prefix = '  '.repeat(indent);
    let output = `${prefix}${root.debug()}\n`;
    for (const dep of root.#dependencies) {
      output += BuildPhase.debugTree(dep, indent + 1);
    }
    return output;
  }
}
```

---

## Research Topics

- [x] BuildPhase pattern (documented above)
- [x] RouteBuilder tree pattern (documented above)
- [x] Schema-based dispatch / multi-contract routing (documented above)
- [x] Ajv validation integration (documented above)
- [x] WebSocket upgrade in Hono (documented above)
- [x] Error response formatting (documented above)
- [x] Request body parsing strategies (JSON vs query params) (documented above)
- [x] HEAD request handling through GET routes (documented above)
- [ ] Hono middleware patterns (general)
- [ ] Response validation (optional feature)
- [ ] Dynamic module loading patterns

---

## Additional Patterns from builder.ts

### Schema-Based Dispatch (Multi-Contract Routing)

When multiple contracts exist on the same path+method, the server must dispatch to the correct one based on request shape:

```typescript
// For each contract on this path+method
const assert = {
  request: contract.request ? ajv.compile(contract.request) : undefined,
  response: ajv.compile(contract.response),
  error: contract.error ? ajv.compile(contract.error) : undefined,
};

// Handler tries to match request schema
handlers[method]!.push(async (context, next) => {
  try {
    let input: unknown;
    if (assert.request) {
      input = await this.#parseInput(context);
      if (!assert.request(input))
        return await next();  // Schema didn't match, try next contract
    }
    // Schema matched (or no request schema), execute this contract
    const output = await handler.default(input, context);
    if (!assert.response(output))
      throw new InvalidResponseError(output);
    return context.json(output);
  } catch (err) {
    if (assert.error && assert.error(err)) {
      return context.json(err, err.status ?? 500);
    }
    throw err;
  }
});
```

**Key behavior:**
- Contracts evaluated in document order
- First contract with matching request schema handles the request
- No match on any contract → `SubrouteNotFoundError` (422)
- No `request` schema means request body not permitted for that contract

### Query Parameter Parsing

```typescript
function parseQueryParams(context: Context): Record<string, unknown> {
  const query = context.req.query();
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(query)) {
    try {
      result[key] = JSON.parse(value);  // Attempt JSON parse
    } catch {
      result[key] = value;  // Fall back to string
    }
  }

  return result;
}
```

### Input Parsing Strategy

The reference implementation tries JSON body first, then falls back to query params:

```typescript
async #parseInput(context: Context): Promise<unknown> {
  const contentLength = context.req.header("content-length");
  const contentType = context.req.header("content-type");

  // Try JSON body if present
  if (contentLength && contentLength !== "0") {
    try {
      const text = await context.req.text();
      if (text && text.trim()) {
        return JSON.parse(text);
      }
    } catch {
      // Invalid JSON, fall through
    }
  } else if (contentType?.includes("application/json")) {
    // Content-Type set but no content-length
    try {
      const text = await context.req.text();
      if (text && text.trim()) {
        return JSON.parse(text);
      }
    } catch {
      // No valid JSON, fall through
    }
  }

  // Fall back to URL query params
  return parseQueryParams(context);
}
```

### Method Dispatching Strategy

| Method | Body Handling | Notes |
|--------|---------------|-------|
| GET | Query params only | No request body expected |
| HEAD | Query params only | Registered on GET route |
| DELETE | Query params only | Body typically ignored |
| POST | JSON body, fallback to query | Primary body methods |
| PUT | JSON body, fallback to query | |
| PATCH | JSON body, fallback to query | |

### HEAD Request Routing

Hono routes HEAD requests through GET handlers. The reference handles this by:
1. Registering HEAD contracts on GET
2. Checking `c.req.method` in the handler to skip non-HEAD requests

```typescript
// Registration
const registrationMethod = method === "HEAD" ? "GET" : method;
endpoint.on(registrationMethod, '/', ...method_handlers, ...);

// In handler
if (method === "HEAD" && context.req.method !== "HEAD") {
  return await next();
}
```

### WebSocket Upgrade

For contracts with `ws: true` (or `websocket: true` in reference):

```typescript
if (contract.websocket) {
  // Prepend upgradeWebSocket middleware BEFORE the handler
  const wsHandler = upgradeWebSocket(async (c) => {
    const modulePath = base
      ? new URL(contract.module, base).href
      : contract.module;
    const handler = await import(modulePath);
    return handler.ws(c);  // Module exports ws() for WebSocket handling
  });
  handlers[method]!.push(wsHandler);
}
```

**WebSocket flow:**
1. `upgradeWebSocket` middleware detects upgrade request
2. Dynamically imports the contract's module
3. Calls `module.ws(context)` which returns WebSocket event handlers
4. Hono handles the protocol upgrade

### Error Handling Pattern

```typescript
endpoint.onError((err, c) => {
  if (err instanceof SubrouteNotFoundError)
    return c.json({ message: err.message }, 422);  // No matching contract
  if (err instanceof InvalidResponseError)
    return c.json({ message: "Invalid response from server", cause: err.cause }, 500);
  return c.json({ message: "Internal server error", cause: String(err) }, 500);
});
```
