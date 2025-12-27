import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";
import type { IWorkspaceRepository } from "../../core/interfaces/repositories/IWorkspaceRepository.js";
import type { ICacheService } from "../../core/interfaces/services/ICacheService.js";
import { NotFoundError, ForbiddenError } from "../../core/errors/AppError.js";

export interface DeleteProjectDTO {
  projectId: string;
  userId: string;
}

export class DeleteProject {
  constructor(
    private projectRepository: IProjectRepository,
    private workspaceRepository: IWorkspaceRepository,
    private cacheService: ICacheService
  ) {}

  async execute(dto: DeleteProjectDTO): Promise<void> {
    // Get project
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    // Only owner can delete
    if (!project.isOwner(dto.userId)) {
      throw new ForbiddenError("Only project owner can delete the project");
    }

    // Delete all workspaces in this project
    const workspaces = await this.workspaceRepository.findByProjectId(
      dto.projectId
    );
    for (const workspace of workspaces) {
      await this.workspaceRepository.delete(workspace.id);
    }

    // Delete project
    await this.projectRepository.delete(dto.projectId);

    // Clear caches
    await this.cacheService.delete(`project:${dto.projectId}`);
    await this.cacheService.delete(`user:${project.ownerId}:projects`);
  }
}
