import { Project } from "../../core/entities/Project.js";
import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";
import type { ICacheService } from "../../core/interfaces/services/ICacheService.js";

export interface ListProjectsDTO {
  userId: string;
}

export class ListProjects {
  constructor(
    private projectRepository: IProjectRepository,
    private cacheService: ICacheService
  ) {}

  async execute(dto: ListProjectsDTO): Promise<Project[]> {
    // Try cache first
    const cacheKey = `user:${dto.userId}:projects`;
    const cachedProjects = await this.cacheService.get<Project[]>(cacheKey);
    if (cachedProjects) {
      return cachedProjects;
    }

    // Get from database
    const projects = await this.projectRepository.findByOwnerId(dto.userId);

    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, projects, 300);

    return projects;
  }
}
