import { Injectable, LogLevel, LoggerService as _LoggerService } from '@nestjs/common';
import { logger as _logger } from './logger';

@Injectable()
export class LoggerService implements _LoggerService {
  logger: any;
  constructor(private context?: string) {
    this.logger = context ? _logger.child({ context: context }) : _logger;
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }
  error(message: any, ...optionalParams: any[]) {
    if (typeof message === 'string') {
      this.logger.error(optionalParams, message);
    } else {
      this.logger.error(message, ...optionalParams);
    }
  }
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }
  trace?(message: any, ...optionalParams: any[]) {
    this.logger.trace(message, ...optionalParams);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.trace(message, ...optionalParams);
  }
  setLogLevels?(levels: LogLevel[]) {
    this.logger.level = levels[0];
  }
}
