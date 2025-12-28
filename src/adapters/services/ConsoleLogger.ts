import type { ILogger } from "../../core/interfaces/ILogger.js";

export class ConsoleLogger implements ILogger {
  info(message: string, meta?: any): void {
    console.log(`[INFO] ${message}`, meta || "");
  }

  error(message: string, error?: Error, meta?: any): void {
    console.error(`[ERROR] ${message}`, error?.message || "", meta || "");
    if (error?.stack) {
      console.error(error.stack);
    }
  }

  warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${message}`, meta || "");
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, meta || "");
    }
  }
}
