import type { Request, Response } from "express";
import type { CreateWorkspace } from "../../use-cases/workspaces/CreateWorkspace.js";
import type { ListWorkspaces } from "../../use-cases/workspaces/ListWorkspaces.js";
import { AppError } from "../../core/errors/AppError.js";

export class WorkspaceController {
  constructor(
    private createWorkspace: CreateWorkspace,
    private listWorkspaces: ListWorkspaces
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { projectId, name, settings } = req.body;
      const userId = (req as any).user?.id;

      const workspace = await this.createWorkspace.execute({
        projectId,
        userId,
        name,
        settings,
      });

      res.status(201).json({
        success: true,
        data: {
          id: workspace.id,
          projectId: workspace.projectId,
          name: workspace.name,
          settings: workspace.settings,
          createdAt: workspace.createdAt,
          updatedAt: workspace.updatedAt,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = (req as any).user?.id;

      if (!projectId) {
        res.status(400).json({ success: false, error: "Project ID required" });
        return;
      }

      const workspaces = await this.listWorkspaces.execute({
        projectId,
        userId,
      });

      res.status(200).json({
        success: true,
        data: workspaces.map((w) => ({
          id: w.id,
          projectId: w.projectId,
          name: w.name,
          settings: w.settings,
          createdAt: w.createdAt,
          updatedAt: w.updatedAt,
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
