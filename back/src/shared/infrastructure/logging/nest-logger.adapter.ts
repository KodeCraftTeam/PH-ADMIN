import { Injectable, Logger } from '@nestjs/common';
import { LoggerPort } from '../../domain/ports/out/logger.port';

@Injectable()
export class NestLoggerAdapter implements LoggerPort {
  private readonly logger = new Logger();

  log(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }
}
