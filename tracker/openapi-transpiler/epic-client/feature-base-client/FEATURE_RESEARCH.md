# Feature: base-client - Research

## Reference Implementation

From epic-client EPIC_RESEARCH.md, the Client class:

```typescript
export class Client implements HasUrl {
  #url?: string;
  #parent?: HasUrl;
  #path?: string;

  constructor(url: string | HasUrl, path?: string) {
    if (typeof url === "string") {
      this.#url = url;
    } else {
      this.#parent = url;
      this.#path = path ?? "";
    }
  }

  get url(): string {
    if (this.#url) return this.#url;
    const parentUrl = this.#parent!.url;
    const base = parentUrl.endsWith("/") ? parentUrl : parentUrl + "/";
    return this.#path ? new URL(this.#path, base).href : parentUrl;
  }

  get path(): string {
    if (this.#parent?.path)
      return [this.#parent.path, this.#path].filter(Boolean).join("/");
    return this.#path ?? "";
  }
}
```

## Usage Pattern

```typescript
const root = new Client("http://localhost:3000");
const users = new Client(root, "users");    // http://localhost:3000/users
const user = new Client(users, "123");      // http://localhost:3000/users/123
```
