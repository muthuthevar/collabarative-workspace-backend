import type { Request, Response } from "express";
import type { BroadcastEvent } from "../../use-cases/colloboration/BroadcastEvent.js";
import type { GetActivityHistory } from "../../use-cases/colloboration/GetActivityHistory.js";
import { AppError } from "../../core/errors/AppError.js";

export class CollaborationController {
  constructor(
    private broadcastEvent: BroadcastEvent,
    private getActivityHistory: GetActivityHistory
  ) {}

  async broadcast(req: Request, res: Response): Promise<void> {
    try {
      const { projectId, type, payload } = req.body;
      const userId = (req as any).user?.id;

      await this.broadcastEvent.execute({
        projectId,
        userId,
        type,
        payload,
      });

      res.status(200).json({
        success: true,
        message: "Event broadcasted successfully",
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = (req as any).user?.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      if (!projectId) {
        res.status(400).json({ success: false, error: "Project ID required" });
        return;
      }

      const activities = await this.getActivityHistory.execute({
        projectId,
        userId,
        limit,
      });

      res.status(200).json({
        success: true,
        data: activities.map((a) => ({
          id: a.id,
          projectId: a.projectId,
          userId: a.userId,
          type: a.type,
          payload: a.payload,
          timestamp: a.timestamp,
        })),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
