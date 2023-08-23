import express, { Request } from 'express';
import request from 'supertest';
import { ContextManager } from './context-manager';
import { ContextMiddleware } from './context-middleware';

describe('ContextMiddleware', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
  });

  it('should create a request context with a default key', async () => {
    app.use(ContextMiddleware());
    app.get('/test', (req: Request, res) => {
      req.ctx.merge({ key: 'value' });
      res.json(req.ctx.get());
    });

    const response = await request(app).get('/test');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ key: 'value' });
  });

  it('should create a request context with a custom key', async () => {
    app.use(ContextMiddleware('customKey'));
    app.get('/test', (req: Request, res) => {
      req.ctx.merge({ key: 'value' });
      res.json(req.ctx.get());
    });

    const response = await request(app).get('/test');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ key: 'value' });
  });

  it('should keep contexts isolated between requests', async () => {
    app.use(ContextMiddleware());
    app.get('/test1', (req: Request, res) => {
      req.ctx.merge({ key: 'value1' });
      res.json(req.ctx.get());
    });
    app.get('/test2', (req: Request, res) => {
      req.ctx.merge({ key: 'value2' });
      res.json(req.ctx.get());
    });

    const response1 = await request(app).get('/test1');
    const response2 = await request(app).get('/test2');

    expect(response1.status).toBe(200);
    expect(response1.body).toEqual({ key: 'value1' });
    expect(response2.status).toBe(200);
    expect(response2.body).toEqual({ key: 'value2' });
  });
});
