import { Project } from "../../core/entities/Project.js";
import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";
import type { ICacheService } from "../../core/interfaces/services/ICacheService.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "../../core/errors/AppError.js";

export interface UpdateProjectDTO {
  projectId: string;
  userId: string;
  name?: string;
  description?: string;
}

export class UpdateProject {
  constructor(
    private projectRepository: IProjectRepository,
    private cacheService: ICacheService
  ) {}

  async execute(dto: UpdateProjectDTO): Promise<Project> {
    // Get project
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    // Only owner can update
    if (!project.isOwner(dto.userId)) {
      throw new ForbiddenError("Only project owner can update the project");
    }

    // Validate and update name
    if (dto.name !== undefined) {
      if (dto.name.trim().length < 3) {
        throw new ValidationError("Project name must be at least 3 characters");
      }
      if (dto.name.length > 100) {
        throw new ValidationError(
          "Project name must not exceed 100 characters"
        );
      }
      project.updateName(dto.name.trim());
    }

    // Validate and update description
    if (dto.description !== undefined) {
      if (dto.description.length > 500) {
        throw new ValidationError("Description must not exceed 500 characters");
      }
      project.updateDescription(dto.description.trim());
    }

    // Save to database
    await this.projectRepository.update(project);

    // Clear caches
    await this.cacheService.delete(`project:${dto.projectId}`);
    await this.cacheService.delete(`user:${project.ownerId}:projects`);

    return project;
  }
}
