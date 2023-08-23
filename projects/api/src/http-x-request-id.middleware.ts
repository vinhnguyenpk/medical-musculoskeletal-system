import nanoid from 'nanoid';

const makeRequestId = nanoid.customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 21);

export function HttpRequestIdMiddleware(genFn: () => string = makeRequestId) {
  return (req: any, res: any, next: () => void) => {
    const correlationHeader = req.header('x-request-id') || genFn();
    // make sure this is lower-cased, otherwise downstream stuff will barf.
    req.headers['x-request-id'] = correlationHeader;
    res.set('x-request-id', correlationHeader);
    if (req.ctx) {
      req.ctx.merge({ requestId: correlationHeader });
    }
    next();
  };
}
