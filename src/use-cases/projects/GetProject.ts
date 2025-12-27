import { Project } from "../../core/entities/Project.js";
import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";
import type { IProjectMemberRepository } from "../../core/interfaces/repositories/IProjectMemberRepository.js";
import type { ICacheService } from "../../core/interfaces/services/ICacheService.js";
import { NotFoundError, ForbiddenError } from "../../core/errors/AppError.js";

export interface GetProjectDTO {
  projectId: string;
  userId: string;
}

export class GetProject {
  constructor(
    private projectRepository: IProjectRepository,
    private projectMemberRepository: IProjectMemberRepository,
    private cacheService: ICacheService
  ) {}

  async execute(dto: GetProjectDTO): Promise<Project> {
    // Try cache first
    const cacheKey = `project:${dto.projectId}`;
    const cachedProject = await this.cacheService.get<Project>(cacheKey);
    if (cachedProject) {
      // Still need to verify access
      await this.verifyAccess(dto.projectId, dto.userId);
      return cachedProject;
    }

    // Get from database
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    // Verify user has access
    await this.verifyAccess(dto.projectId, dto.userId);

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, project, 300);

    return project;
  }

  private async verifyAccess(projectId: string, userId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    // Owner has access
    if (project.isOwner(userId)) {
      return;
    }

    // Check if user is a member
    const member = await this.projectMemberRepository.findByProjectAndUser(
      projectId,
      userId
    );

    if (!member) {
      throw new ForbiddenError("You do not have access to this project");
    }
  }
}
