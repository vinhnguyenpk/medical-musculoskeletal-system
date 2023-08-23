import * as Sentry from '@sentry/node';

export const initSentry = (config: Sentry.NodeOptions) => {
  Sentry.init(config);
};
