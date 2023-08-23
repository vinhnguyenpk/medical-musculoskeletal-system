import { Request } from 'express';
import { ContextManager } from './context-manager';
import _ from 'lodash';

declare module 'express' {
  interface Request {
    ctx: {
      merge: (value: Record<string, any>) => void;
      get: () => Record<string, any>;
    };
  }
}

function createRequestContext(key: string, initialValue: Record<string, any> = {}) {
  // logger.debug('createRequestContext', { key, initialValue });
  ContextManager.getInstance().set(key, initialValue);

  return {
    merge: (value) => {
      const ctx = (ContextManager.getInstance().get(key) || {}) as Record<string, any>;
      ContextManager.getInstance().set(key, _.merge({}, ctx, value));
    },
    get: () => {
      return ContextManager.getInstance().get(key) || {};
    }
  };
}

export function ContextMiddleware(key = 'default') {
  // logger.debug('ContextMiddleware %o', { key });
  return (req: Request, res: any, next: () => void) => {
    // logger.debug('ContextMiddleware %o', { key });
    ContextManager.getInstance().run(async () => {
      req.ctx = createRequestContext(key);
      // logger.debug('ContextMiddleware %o', { key, ctx: req.ctx });
      next();
    });
  };
}
