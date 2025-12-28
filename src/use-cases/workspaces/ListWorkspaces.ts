import { Workspace } from "../../core/entities/Workspace.js";
import type { IWorkspaceRepository } from "../../core/interfaces/repositories/IWorkspaceRepository.js";
import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";
import type { IProjectMemberRepository } from "../../core/interfaces/repositories/IProjectMemberRepository.js";
import { NotFoundError, ForbiddenError } from "../../core/errors/AppError.js";

export interface ListWorkspacesDTO {
  projectId: string;
  userId: string;
}

export class ListWorkspaces {
  constructor(
    private workspaceRepository: IWorkspaceRepository,
    private projectRepository: IProjectRepository,
    private projectMemberRepository: IProjectMemberRepository
  ) {}

  async execute(dto: ListWorkspacesDTO): Promise<Workspace[]> {
    // Check if project exists
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    // Verify user has access
    const isOwner = project.isOwner(dto.userId);
    const member = await this.projectMemberRepository.findByProjectAndUser(
      dto.projectId,
      dto.userId
    );

    if (!isOwner && !member) {
      throw new ForbiddenError("You do not have access to this project");
    }

    return await this.workspaceRepository.findByProjectId(dto.projectId);
  }
}
