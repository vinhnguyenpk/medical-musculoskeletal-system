import { Injectable, NestMiddleware } from '@nestjs/common';
import { logger } from './logger';
import { Request, Response } from 'express';

type AuthReq = Request & { login?: { id: string }; user?: { id: string } };

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: AuthReq, res: Response, next: Function) {
    const start = Date.now();
    const context = req.ctx && req.ctx.get();
    const log = logger.child({
      requestId: context?.requestId,
      req: {
        label: 'http',
        ip: req.ip,
        method: req.method,
        url: req.originalUrl
      }
    });

    if (req.method === 'POST' && req.body) {
      logger.info(
        {
          req: {
            body: req.body
          }
        },
        'http POST request'
      );
    }

    res.on('close', () => {
      if (process.env.NODE_ENV == 'production' && req.originalUrl === '/') {
        return;
      }

      const endTime = Date.now();
      const elapsed = endTime - start;
      const obj = {
        status: res.statusCode,
        elapsed: elapsed
      };
      let msg = `${res.statusCode} - ${req.method} ${req.originalUrl}`;
      if (res.statusCode >= 500) {
        log.error(obj, msg);
      } else if (res.statusCode >= 400) {
        log.warn(obj, msg);
      } else {
        log.info(obj, msg);
      }
    });
    next();
  }
}
