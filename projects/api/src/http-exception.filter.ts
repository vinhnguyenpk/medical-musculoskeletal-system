import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  HttpStatus,
  NotAcceptableException,
  PreconditionFailedException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { ThrottlerException } from "@nestjs/throttler";
import { Request, Response } from "express";
import { logger } from "./lib/logger";

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    let resData = {};

    if (process.env.NODE_ENV !== "production") {
      resData["_exception"] = {
        name: exception.name,
        message: exception.message,
      };
    }

    if (exception instanceof ThrottlerException) {
      return response.status(HttpStatus.TOO_MANY_REQUESTS).json({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: "Too many requests. Please try again later.",
      });
    }

    if (exception instanceof HttpException) {
      exception satisfies HttpException;
      const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : exceptionResponse["message"] || "Internal Server Error";
      resData = {
        ...(typeof message === "object" ? message : {}),
      };

      logger.info(message);

      switch (true) {
        case exception instanceof UnauthorizedException:
        case exception instanceof BadRequestException:
        case exception instanceof UnprocessableEntityException:
        case exception instanceof PreconditionFailedException:
        case exception instanceof NotAcceptableException:
          return response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
            ...(typeof message === "object" ? message : {}),
            ...resData,
            ...(exceptionResponse?.["remainingAttempts"] ||
            exceptionResponse?.["lockedUntil"]
              ? {
                  remainingAttempts: exceptionResponse["remainingAttempts"],
                  lockedUntil: exceptionResponse["lockedUntil"],
                }
              : {}),
          });
        case exception instanceof HttpException:
          return response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
            ...resData,
          });

        default:
          logger.error(
            exception,
            `Unexpected error on ${request.url}: ${exception}`
          );
          return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: 500,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: "Internal Server Error",
            ...resData,
          });
      }
    }
    logger.error(exception, `Unexpected error on ${request.url}: ${exception}`);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: "Internal Server Error",
    });
  }
}
