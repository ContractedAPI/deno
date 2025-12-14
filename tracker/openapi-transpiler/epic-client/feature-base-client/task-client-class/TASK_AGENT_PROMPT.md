# Task: client-class - Agent Prompt

> **Branch**: `openapi-transpiler/epic-client/feature-base-client/task-client-class/task`

## Implementation
```typescript
export class Client implements HasUrl {
  private _url: string;
  private _path: string;
  private _parent?: HasUrl;

  constructor(url: string);
  constructor(parent: HasUrl, path: string);
  constructor(urlOrParent: string | HasUrl, path?: string) {
    if (typeof urlOrParent === 'string') {
      this._url = urlOrParent;
      this._path = '';
    } else {
      this._parent = urlOrParent;
      this._path = path || '';
      this._url = '';
    }
  }

  get url(): string {
    if (this._parent) {
      return normalizeUrl(this._parent.url, this._path);
    }
    return this._url;
  }

  get path(): string {
    if (this._parent) {
      return joinPath(this._parent.path, this._path);
    }
    return this._path;
  }
}
```

## Commit
`feat: add Client class`
