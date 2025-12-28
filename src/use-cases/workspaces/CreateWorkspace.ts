import { Workspace } from "../../core/entities/Workspace.js";
import type { IWorkspaceRepository } from "../../core/interfaces/repositories/IWorkspaceRepository.js";
import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";
import type { IProjectMemberRepository } from "../../core/interfaces/repositories/IProjectMemberRepository.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "../../core/errors/AppError.js";
import { v4 as uuidv4 } from "uuid";

export interface CreateWorkspaceDTO {
  projectId: string;
  userId: string;
  name: string;
  settings?: Record<string, any>;
}

export class CreateWorkspace {
  constructor(
    private workspaceRepository: IWorkspaceRepository,
    private projectRepository: IProjectRepository,
    private projectMemberRepository: IProjectMemberRepository
  ) {}

  async execute(dto: CreateWorkspaceDTO): Promise<Workspace> {
    // Validate workspace name
    if (!dto.name || dto.name.trim().length < 3) {
      throw new ValidationError("Workspace name must be at least 3 characters");
    }

    // Check if project exists
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    // Verify user has edit access
    const isOwner = project.isOwner(dto.userId);
    const member = await this.projectMemberRepository.findByProjectAndUser(
      dto.projectId,
      dto.userId
    );

    if (!isOwner && (!member || !member.canEdit())) {
      throw new ForbiddenError(
        "You do not have permission to create workspaces"
      );
    }

    // Check workspace limit (max 20 per project)
    const existingWorkspaces = await this.workspaceRepository.findByProjectId(
      dto.projectId
    );
    if (existingWorkspaces.length >= 20) {
      throw new ValidationError(
        "Maximum workspace limit (20) reached for this project"
      );
    }

    // Create workspace
    const workspace = new Workspace(
      uuidv4(),
      dto.projectId,
      dto.name.trim(),
      dto.settings || {},
      new Date(),
      new Date()
    );

    await this.workspaceRepository.create(workspace);

    return workspace;
  }
}
