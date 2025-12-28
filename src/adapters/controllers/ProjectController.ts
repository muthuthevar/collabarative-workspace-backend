import type { Request, Response } from "express";
import type { CreateProject } from "../../use-cases/projects/CreateProject.js";
import type { GetProject } from "../../use-cases/projects/GetProject.js";
import type { ListProjects } from "../../use-cases/projects/ListProjects.js";
import type { UpdateProject } from "../../use-cases/projects/UpdateProject.js";
import type { DeleteProject } from "../../use-cases/projects/DeleteProject.js";
import { AppError } from "../../core/errors/AppError.js";

export class ProjectController {
  constructor(
    private createProject: CreateProject,
    private getProject: GetProject,
    private listProjects: ListProjects,
    private updateProject: UpdateProject,
    private deleteProject: DeleteProject
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;
      const userId = (req as any).user?.id;

      const project = await this.createProject.execute({
        name,
        description,
        ownerId: userId,
      });

      res.status(201).json({
        success: true,
        data: {
          id: project.id,
          name: project.name,
          description: project.description,
          ownerId: project.ownerId,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({ success: false, error: "Project ID required" });
        return;
      }

      const project = await this.getProject.execute({
        projectId: id,
        userId,
      });

      res.status(200).json({
        success: true,
        data: {
          id: project.id,
          name: project.name,
          description: project.description,
          ownerId: project.ownerId,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      const projects = await this.listProjects.execute({ userId });

      res.status(200).json({
        success: true,
        data: projects.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          ownerId: p.ownerId,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({ success: false, error: "Project ID required" });
        return;
      }

      const project = await this.updateProject.execute({
        projectId: id,
        userId,
        name,
        description,
      });

      res.status(200).json({
        success: true,
        data: {
          id: project.id,
          name: project.name,
          description: project.description,
          ownerId: project.ownerId,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!id) {
        res.status(400).json({ success: false, error: "Project ID required" });
        return;
      }

      await this.deleteProject.execute({
        projectId: id,
        userId,
      });

      res.status(200).json({
        success: true,
        message: "Project deleted successfully",
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
