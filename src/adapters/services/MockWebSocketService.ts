import type { IWebSocketService } from "../../core/interfaces/services/IWebSocketService.js";
import type { ILogger } from "../../core/interfaces/ILogger.js";

export class MockWebSocketService implements IWebSocketService {
  constructor(private logger: ILogger) {}

  broadcast(event: string, data: any, room?: string): void {
    this.logger.info("WebSocket broadcast", { event, room, data });
    console.log(`🔌 Broadcasting ${event} to ${room || "all"}`);
  }

  sendToUser(userId: string, event: string, data: any): void {
    this.logger.info("WebSocket send to user", { userId, event, data });
    console.log(`🔌 Sending ${event} to user ${userId}`);
  }
}
