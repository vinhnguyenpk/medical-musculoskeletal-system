/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

declare const module: any;

import "./common-init";

import "multer";

import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as Sentry from "@sentry/node";
import chalk from "chalk";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./http-exception.filter";

import express from "express";
import { upperFirst } from "lodash";
import { logger } from "./lib/logger";
import { LoggerService } from "./lib/logger.service";
import { initSentry } from "./sentry/sentry";

export async function bootstrap() {
  initSentry({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.RELEASE_ENV,
    debug: false,
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerService(),
    rawBody: true,
    bodyParser: false,
  });
  app.enableShutdownHooks();
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(Sentry.Handlers.requestHandler({ ip: true, version: true }));
  expressApp.use(Sentry.Handlers.errorHandler());

  const persistRawBody = function (req, res, buf, encoding) {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || "utf8");
    }
  };

  app.use(express.json({ verify: persistRawBody, limit: "10mb" }));
  app.use(
    express.urlencoded({
      verify: persistRawBody,
      limit: "10mb",
      extended: true,
    })
  );
  app.use(express.raw({ verify: persistRawBody, limit: "10mb" }));

  app.use(helmet());
  app.set("trust proxy", true);
  app.set("etag", false);
  app.disable("x-powered-by");
  app.enableCors({
    maxAge: 86400, // 24h
    origin: process.env.CORS_ORIGIN
      ? JSON.parse(process.env.CORS_ORIGIN)
      : "http://localhost:41100",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    exposedHeaders: [
      "X-AUTH-TOKEN",
      "X-REQUEST-ID",
      "X-AUTH-REFRESH-TOKEN",
      "X-MOBILE-TOKEN",
    ],
  });

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.RELEASE_ENV !== "production") {
    const options = new DocumentBuilder()
      .setTitle("Platform API")
      .setDescription("The Platform API")
      .setVersion("2.0")
      .addBearerAuth()
      .build();

    // patchNestjsSwagger();
    const document = SwaggerModule.createDocument(app, options, {
      deepScanRoutes: true,
      operationIdFactory: (controller, method) => {
        const controllerKey = controller.replace("Controller", "");
        const methodKey = `${upperFirst(method)}`;
        return `MUSCULOSKELETAL${controllerKey}${methodKey}`;
      },
    });
    SwaggerModule.setup("docs", app, document);
  }

  const listen = await app.listen(process.env.PORT, process.env.HOST);
  logger.info(
    chalk.green(
      `🚀 Application is running on: ${process.env.HOST || ""}:${
        process.env.PORT
      }`
    )
  );

  if (process.env.NODE_ENV === "development" && module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
