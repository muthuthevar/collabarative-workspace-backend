import { ProjectMember } from "../../entities/ProjectMember.js";

export interface IProjectMemberRepository {
  create(member: ProjectMember): Promise<ProjectMember>;
  findById(id: string): Promise<ProjectMember | null>;
  findByProjectId(projectId: string): Promise<ProjectMember[]>;
  findByProjectAndUser(
    projectId: string,
    userId: string
  ): Promise<ProjectMember | null>;
  update(member: ProjectMember): Promise<ProjectMember>;
  delete(id: string): Promise<void>;
}
