import pino from "pino";
import "pino-pretty";
import { ContextManager } from "./context-manager";

const PinoLevelToSeverityLookup = {
  trace: "DEBUG",
  debug: "DEBUG",
  verbose: "DEBUG",
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
  fatal: "CRITICAL",
};

const customLevels = {
  ...pino.levels.values,
  verbose: 10,
};

const defaultPinoConf: pino.LoggerOptions = {
  messageKey: "message",
  customLevels,
  redact: {
    paths: [
      "req.body.email",
      "req.body.password",
      "req.body.passCode",
      "req.body.new_password",
      "req.body.token",
      "req.headers.authorization",
    ],
    censor: "[**]",
  },
  hooks: {
    logMethod(inputArgs: any, method) {
      if (
        Array.isArray(inputArgs) &&
        inputArgs.length === 2 &&
        inputArgs[0]?.msg
      ) {
        inputArgs[0].originalMsg = inputArgs[0].msg;
      }
      return method.apply(this, inputArgs);
    },
  },
  formatters: {
    log(object) {
      const ctx = ContextManager.getInstance().get("default") as Record<
        string,
        any
      >;
      if (ctx && ctx?.requestId) {
        return { ...object, requestId: ctx.requestId };
      }
      return object;
    },
    level(label, number) {
      return {
        severity:
          PinoLevelToSeverityLookup[label] || PinoLevelToSeverityLookup["info"],
        level: number,
      };
    },
  },
};

const initializeLogger = () => {
  let initOptions = {
    ...defaultPinoConf,
    level: process.env.LOG_LEVEL || "debug",
  };
  let logger = null;

  switch (true) {
    case !!process.env.PRETTY || process.env.NODE_ENV === "development":
      logger = pino({
        ...defaultPinoConf,
        level: process.env.LOG_LEVEL || "trace",
        transport: {
          target: "pino-pretty",
          options: {
            messageKey: "message",
            levelKey: "severity",
            customLevels,
            ignore: "pid,hostname",
            singleLine: true,
            colorize: true,
          },
        },
      });
      break;

    default:
      initOptions = {
        ...defaultPinoConf,
        level: process.env.LOG_LEVEL || "info",
      };
      logger = pino(initOptions);
      break;
  }
  return logger;
};

const logger = initializeLogger();

export const exceptions = (title: string, error: any) => {
  const iseCode = 500;
  const statusCode = error && error.status ? error.status : iseCode;
  const message = error?.message;
  return { statusCode, message };
};

export const IOLogger =
  (prefix: string): any =>
  (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    return (
      target: Object,
      propertyKey: string,
      descriptor: TypedPropertyDescriptor<any>
    ): any => {
      const originalMethod = descriptor.value;
      descriptor.value = function (...args: any[]): any {
        logger.debug(`${prefix} ${propertyKey} Input:`, args);
        const result = originalMethod.apply(this, args);
        logger.debug(`${prefix} ${propertyKey} Output:`, result);
        return result;
      };
    };
  };

export { logger };
