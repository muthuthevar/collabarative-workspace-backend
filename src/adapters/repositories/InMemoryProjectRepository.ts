import type { Project } from "../../core/entities/Project.js";
import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";

export class InMemoryProjectRepository implements IProjectRepository {
  private projects: Map<string, Project> = new Map();

  async create(project: Project): Promise<Project> {
    this.projects.set(project.id, project);
    return project;
  }

  async findById(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  async findByOwnerId(ownerId: string): Promise<Project[]> {
    const result: Project[] = [];
    for (const project of this.projects.values()) {
      if (project.ownerId === ownerId) {
        result.push(project);
      }
    }
    return result;
  }

  async update(project: Project): Promise<Project> {
    this.projects.set(project.id, project);
    return project;
  }

  async delete(id: string): Promise<void> {
    this.projects.delete(id);
  }
}
