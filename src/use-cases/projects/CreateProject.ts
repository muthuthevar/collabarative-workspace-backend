import { Project } from "../../core/entities/Project.js";
import type { IProjectRepository } from "../../core/interfaces/repositories/IProjectRepository.js";
import type { IUserRepository } from "../../core/interfaces/repositories/IUserRepository.js";
import type { ICacheService } from "../../core/interfaces/services/ICacheService.js";
import { ValidationError, NotFoundError } from "../../core/errors/AppError.js";
import { v4 as uuidv4 } from "uuid";

export interface CreateProjectDTO {
  name: string;
  description: string;
  ownerId: string;
}

export class CreateProject {
  constructor(
    private projectRepository: IProjectRepository,
    private userRepository: IUserRepository,
    private cacheService: ICacheService
  ) {}

  async execute(dto: CreateProjectDTO): Promise<Project> {
    // Validate project name
    if (!dto.name || dto.name.trim().length < 3) {
      throw new ValidationError("Project name must be at least 3 characters");
    }

    if (dto.name.length > 100) {
      throw new ValidationError("Project name must not exceed 100 characters");
    }

    // Validate description
    if (dto.description && dto.description.length > 500) {
      throw new ValidationError("Description must not exceed 500 characters");
    }

    // Check if user exists
    const user = await this.userRepository.findById(dto.ownerId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Check project limit (max 50 projects per user)
    const userProjects = await this.projectRepository.findByOwnerId(
      dto.ownerId
    );
    if (userProjects.length >= 50) {
      throw new ValidationError("Maximum project limit (50) reached");
    }

    // Create project entity
    const project = new Project(
      uuidv4(),
      dto.name.trim(),
      dto.description?.trim() || "",
      dto.ownerId,
      new Date(),
      new Date()
    );

    // Save to database
    await this.projectRepository.create(project);

    // Clear user's project cache
    await this.cacheService.delete(`user:${dto.ownerId}:projects`);

    return project;
  }
}
