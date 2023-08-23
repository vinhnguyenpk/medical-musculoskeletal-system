declare const global: any;
global.__basedir = __dirname;
import 'source-map-support/register';
import 'reflect-metadata';

import * as Sentry from '@sentry/node';
import BigNumber from 'bignumber.js';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.RELEASE_ENV,
  release: process.env.RELEASE_VERSION || undefined,
  debug: false,
  integrations: [new Sentry.Integrations.OnUncaughtException()]
});

BigNumber.config({ EXPONENTIAL_AT: 1e9 });
