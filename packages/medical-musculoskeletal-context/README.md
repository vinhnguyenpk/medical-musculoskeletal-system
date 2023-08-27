# @utx/context

`@utx/context` is a lightweight and reusable module designed to help manage and isolate context data in asynchronous operations, such as web server request handling. It is part of a monorepo and can be easily integrated into other libraries or applications within the monorepo.

## Overview

The Context Manager provides a simple and consistent API to store and retrieve context-specific data during the lifecycle of an asynchronous operation. It enables you to share data across different parts of your application without relying on global variables or passing context data through multiple layers of function calls.

## Usage

Here is an example of how to use the @utx/context module in an Express application:


```typescript
import express, { Request } from 'express';
import { ContextMiddleware } from '@utx/context';

const app = express();

app.use(ContextMiddleware());

app.get('/example', (req: Request, res) => {
  req.ctx.merge({ key: 'value' });
  res.json(req.ctx.get());
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

```

In this example, the `ContextMiddleware` from `@utx/context` is used to create a request context for each incoming request. The context can be accessed via req.ctx and is isolated from other requests.

## API

### ContextManager

The Context Manager is a singleton class that manages the storage and retrieval of context data. It provides the following methods:

- `getInstance(): ContextManager`: Get the singleton instance of the Context Manager.
- `run<T>(callback: () => Promise<T>): Promise<T>`: Run a callback with a new, isolated context.
- `set(key: string, value: unknown): void`: Set a value in the current context.
- `get(key: string): unknown`: Get a value from the current context.

### ContextMiddleware

The `ContextMiddleware` is an Express middleware that automatically creates and manages a request context for each incoming request. It takes an optional key parameter, which can be used to customize the context storage key. The default key is `'default'`.

To use the `ContextMiddleware`, simply add it to your Express application:

```javascript
import express, { Request } from 'express';
import { ContextMiddleware } from '@utx/context';

const app = express();

app.use(ContextMiddleware());

app.get('/example', (req: Request, res) => {
  req.ctx.merge({ key: 'value' });
  res.json(req.ctx.get());
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
