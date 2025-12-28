import { ProjectMember } from "../../core/entities/ProjectMember.js";
import type { IProjectMemberRepository } from "../../core/interfaces/repositories/IProjectMemberRepository.js";
import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";
import type { IUserRepository } from "../../core/interfaces/repositories/IUserRepository.js";
import type { IEmailService } from "../../core/interfaces/services/IEmailService.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../core/errors/AppError.js";
import { v4 as uuidv4 } from "uuid";

export interface InviteMemberDTO {
  projectId: string;
  inviterId: string;
  userEmail: string;
  role: "COLLABORATOR" | "VIEWER";
}

export class InviteMember {
  constructor(
    private projectMemberRepository: IProjectMemberRepository,
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}

  async execute(dto: InviteMemberDTO): Promise<ProjectMember> {
    // Check if project exists
    const project = await this.projectRepository.findById(dto.projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    // Only owner can invite
    if (!project.isOwner(dto.inviterId)) {
      throw new ForbiddenError("Only project owner can invite members");
    }

    // Find user to invite
    const userToInvite = await this.userRepository.findByEmail(dto.userEmail);
    if (!userToInvite) {
      throw new NotFoundError("User not found");
    }

    // Check if already a member
    const existingMember =
      await this.projectMemberRepository.findByProjectAndUser(
        dto.projectId,
        userToInvite.id
      );
    if (existingMember) {
      throw new ConflictError("User is already a member of this project");
    }

    // Check member limit (max 50 per project)
    const members = await this.projectMemberRepository.findByProjectId(
      dto.projectId
    );
    if (members.length >= 50) {
      throw new ValidationError("Maximum member limit (50) reached");
    }

    // Create member
    const member = new ProjectMember(
      uuidv4(),
      dto.projectId,
      userToInvite.id,
      dto.role,
      dto.inviterId,
      new Date()
    );

    await this.projectMemberRepository.create(member);

    // Send invitation email
    await this.emailService.sendInvitationEmail(
      dto.userEmail,
      project.name,
      `https://app.example.com/projects/${dto.projectId}`
    );

    return member;
  }
}
