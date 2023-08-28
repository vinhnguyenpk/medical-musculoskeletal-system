/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';

// import { AppModule } from './app/app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const globalPrefix = 'api';
//   app.setGlobalPrefix(globalPrefix);
//   const port = process.env.PORT || 3333;
//   await app.listen(port);
//   Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
// }

// bootstrap();

import "@/common-init";
import "multer";

import { HttpRequestIdMiddleware } from "@/http-x-request-id.middleware";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as Sentry from "@sentry/node";
import helmet from "helmet";

import { AdminAPIModule } from "@/admin-api/admin-api.module";

import { LoggerService } from "@medical-musculoskeletal/logger";
import { WsAdapter } from "@nestjs/platform-ws";

export async function bootstrap() {
  const port = Number(process.env.PORT || "50100");
  const app = await NestFactory.create<NestExpressApplication>(AdminAPIModule, {
    logger: new LoggerService(),
  });
  app.useWebSocketAdapter(new WsAdapter(app));
  const expressApp = app.getHttpAdapter().getInstance();

  if (process.env.SENTRY_DSN) {
    expressApp.use(Sentry.Handlers.requestHandler({ ip: true, version: true }));
    expressApp.use(Sentry.Handlers.errorHandler());
  }

  app.enableShutdownHooks();
  app.use(HttpRequestIdMiddleware());
  app.set("etag", false);
  app.use(helmet());
  app.disable("x-powered-by");
  app.enableCors({
    maxAge: 7200,
    origin: process.env.CORS_ORIGIN
      ? JSON.parse(process.env.CORS_ORIGIN)
      : "http://localhost:6000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    exposedHeaders: ["AUTHORIZATION", "X-REQUEST-ID"],
  });

  // const adminAuthGuard = app.get(AdminAuthGuard);

  app.set("trust proxy", true);
  app.set("etag", false);
  app.use(helmet());
  // app.useGlobalGuards(adminAuthGuard);

  if (process.env.NODE_ENV !== "production") {
    const options = new DocumentBuilder()
      .setTitle("AW Admin API")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    // patchNestjsSwagger();
    const document = SwaggerModule.createDocument(app, options, {
      deepScanRoutes: true,
    });
    SwaggerModule.setup("docs", app, document);
  }

  await app.listen(port);
  Logger.log(`🚀 admin-api Listening on http://0.0.0.0:${port}`);
}

bootstrap();
