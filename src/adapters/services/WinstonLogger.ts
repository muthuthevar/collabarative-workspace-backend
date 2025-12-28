import winston from "winston";
import type { ILogger } from "../../core/interfaces/ILogger.js";

export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: "collaborative-workspace" },
      transports: [
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: "logs/combined.log",
          maxsize: 5242880,
          maxFiles: 5,
        }),
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(
              ({ level, message, timestamp, ...metadata }) => {
                let msg = `${timestamp} [${level}]: ${message}`;
                if (Object.keys(metadata).length > 0) {
                  msg += ` ${JSON.stringify(metadata)}`;
                }
                return msg;
              }
            )
          ),
        })
      );
    }
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error | any): void {
    this.logger.error(message, { error: error?.message, stack: error?.stack });
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }
}
