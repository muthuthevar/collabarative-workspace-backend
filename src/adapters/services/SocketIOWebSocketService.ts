import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import type { IWebSocketService } from "../../core/interfaces/services/IWebSocketService.js";
import type { ILogger } from "../../core/interfaces/ILogger.js";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  projectId?: string;
}

export class SocketIOWebSocketService implements IWebSocketService {
  private io: SocketIOServer | null = null;
  private userSockets: Map<string, Set<string>> = new Map();
  private projectRooms: Map<string, Set<string>> = new Map();

  constructor(private logger: ILogger) {}

  initialize(server: HTTPServer): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.io.on("connection", (socket: AuthenticatedSocket) => {
      this.logger.info("WebSocket client connected", { socketId: socket.id });

      socket.on("authenticate", (data: { userId: string; token: string }) => {
        socket.userId = data.userId;

        if (!this.userSockets.has(data.userId)) {
          this.userSockets.set(data.userId, new Set());
        }
        this.userSockets.get(data.userId)?.add(socket.id);

        this.logger.info("User authenticated on WebSocket", {
          userId: data.userId,
          socketId: socket.id,
        });

        socket.emit("authenticated", { success: true });
      });

      socket.on("join-project", (data: { projectId: string }) => {
        socket.projectId = data.projectId;
        socket.join(`project:${data.projectId}`);

        if (!this.projectRooms.has(data.projectId)) {
          this.projectRooms.set(data.projectId, new Set());
        }
        this.projectRooms.get(data.projectId)?.add(socket.id);

        this.logger.info("User joined project room", {
          userId: socket.userId,
          projectId: data.projectId,
          socketId: socket.id,
        });

        this.broadcast(`project:${data.projectId}`, "user-joined", {
          userId: socket.userId,
          timestamp: new Date().toISOString(),
        });
      });

      socket.on("leave-project", (data: { projectId: string }) => {
        socket.leave(`project:${data.projectId}`);
        this.projectRooms.get(data.projectId)?.delete(socket.id);

        this.logger.info("User left project room", {
          userId: socket.userId,
          projectId: data.projectId,
        });

        this.broadcast(`project:${data.projectId}`, "user-left", {
          userId: socket.userId,
          timestamp: new Date().toISOString(),
        });
      });

      socket.on(
        "cursor-move",
        (data: { projectId: string; x: number; y: number }) => {
          this.broadcast(`project:${data.projectId}`, "cursor-update", {
            userId: socket.userId,
            x: data.x,
            y: data.y,
            timestamp: new Date().toISOString(),
          });
        }
      );

      socket.on(
        "file-change",
        (data: { projectId: string; fileId: string; changes: any }) => {
          this.broadcast(`project:${data.projectId}`, "file-changed", {
            userId: socket.userId,
            fileId: data.fileId,
            changes: data.changes,
            timestamp: new Date().toISOString(),
          });
        }
      );

      socket.on("disconnect", () => {
        this.logger.info("WebSocket client disconnected", {
          userId: socket.userId,
          socketId: socket.id,
        });

        if (socket.userId) {
          this.userSockets.get(socket.userId)?.delete(socket.id);
          if (this.userSockets.get(socket.userId)?.size === 0) {
            this.userSockets.delete(socket.userId);
          }
        }

        if (socket.projectId) {
          this.projectRooms.get(socket.projectId)?.delete(socket.id);
          this.broadcast(`project:${socket.projectId}`, "user-left", {
            userId: socket.userId,
            timestamp: new Date().toISOString(),
          });
        }
      });

      socket.on("error", (error) => {
        this.logger.error("WebSocket error", error);
      });
    });

    this.logger.info("WebSocket server initialized");
  }

  broadcast(room: string, event: string, data: any): void {
    if (!this.io) {
      this.logger.warn("WebSocket server not initialized");
      return;
    }

    this.io.to(room).emit(event, data);
    this.logger.debug("Broadcast event", { room, event, data });
  }

  sendToUser(userId: string, event: string, data: any): void {
    if (!this.io) {
      this.logger.warn("WebSocket server not initialized");
      return;
    }

    const socketIds = this.userSockets.get(userId);
    if (socketIds) {
      socketIds.forEach((socketId) => {
        this.io?.to(socketId).emit(event, data);
      });
      this.logger.debug("Sent event to user", { userId, event, data });
    }
  }

  getConnectedUsers(projectId: string): number {
    return this.projectRooms.get(projectId)?.size || 0;
  }
}
