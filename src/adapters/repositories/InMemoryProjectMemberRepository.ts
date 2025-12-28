import type { ProjectMember } from "../../core/entities/ProjectMember.js";
import type { IProjectMemberRepository } from "../../core/interfaces/repositories/IProjectMemberRepository.js";

export class InMemoryProjectMemberRepository
  implements IProjectMemberRepository
{
  private members: Map<string, ProjectMember> = new Map();

  async create(member: ProjectMember): Promise<ProjectMember> {
    this.members.set(member.id, member);
    return member;
  }

  async findById(id: string): Promise<ProjectMember | null> {
    return this.members.get(id) || null;
  }

  async findByProjectId(projectId: string): Promise<ProjectMember[]> {
    const result: ProjectMember[] = [];
    for (const member of this.members.values()) {
      if (member.projectId === projectId) {
        result.push(member);
      }
    }
    return result;
  }

  async findByUserId(userId: string): Promise<ProjectMember[]> {
    const result: ProjectMember[] = [];
    for (const member of this.members.values()) {
      if (member.userId === userId) {
        result.push(member);
      }
    }
    return result;
  }

  async findByProjectAndUser(
    projectId: string,
    userId: string
  ): Promise<ProjectMember | null> {
    for (const member of this.members.values()) {
      if (member.projectId === projectId && member.userId === userId) {
        return member;
      }
    }
    return null;
  }

  async update(member: ProjectMember): Promise<ProjectMember> {
    this.members.set(member.id, member);
    return member;
  }

  async delete(id: string): Promise<void> {
    this.members.delete(id);
  }
}
