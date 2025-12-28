import { ProjectMember } from "../../core/entities/ProjectMember.js";
import type { IProjectMemberRepository } from "../../core/interfaces/repositories/IProjectMemberRepository.js";
import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";
import { NotFoundError, ForbiddenError } from "../../core/errors/AppError.js";

export interface ListMembersDTO {
  projectId: string;
  userId: string;
}

export class ListMembers {
  constructor(
    private projectMemberRepository: IProjectMemberRepository,
    private projectRepository: IProjectRepository
  ) {}

  async execute(dto: ListMembersDTO): Promise<ProjectMember[]> {
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

    return await this.projectMemberRepository.findByProjectId(dto.projectId);
  }
}
