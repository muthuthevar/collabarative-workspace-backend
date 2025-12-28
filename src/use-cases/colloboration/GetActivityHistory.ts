import { Activity } from "../../core/entities/Activity.js";
import type { IActivityRepository } from "../../core/interfaces/repositories/IActivityRepository.js";
import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";
import type { IProjectMemberRepository } from "../../core/interfaces/repositories/IProjectMemberRepository.js";
import { NotFoundError, ForbiddenError } from "../../core/errors/AppError.js";

export interface GetActivityHistoryDTO {
  projectId: string;
  userId: string;
  limit?: number;
}

export class GetActivityHistory {
  constructor(
    private activityRepository: IActivityRepository,
    private projectRepository: IProjectRepository,
    private projectMemberRepository: IProjectMemberRepository
  ) {}

  async execute(dto: GetActivityHistoryDTO): Promise<Activity[]> {
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

    const limit = dto.limit || 50;
    return await this.activityRepository.findByProjectId(dto.projectId, limit);
  }
}
