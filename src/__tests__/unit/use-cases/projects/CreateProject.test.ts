import { CreateProject } from "../../../../use-cases/projects/CreateProject.js";
import { Project } from "../../../../core/entities/Project.js";
import type { IProjectRepository } from "../../../../core/interfaces/repositories/IProjectRepository.js";
import type { IUserRepository } from "../../../../core/interfaces/repositories/IUserRepository.js";
import type { ICacheService } from "../../../../core/interfaces/services/ICacheService.js";
import {
  ValidationError,
  NotFoundError,
} from "../../../../core/errors/AppError.js";
import { User } from "../../../../core/entities/User.js";

describe("CreateProject Use Case", () => {
  let createProject: CreateProject;
  let mockProjectRepository: jest.Mocked<IProjectRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockCacheService: jest.Mocked<ICacheService>;

  beforeEach(() => {
    mockProjectRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
    };

    createProject = new CreateProject(
      mockProjectRepository,
      mockUserRepository,
      mockCacheService
    );
  });

  it("should throw ValidationError for empty project name", async () => {
    await expect(
      createProject.execute({
        name: "",
        description: "Test project",
        ownerId: "user-id",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should throw NotFoundError if user does not exist", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      createProject.execute({
        name: "Test Project",
        description: "Test description",
        ownerId: "non-existent-user",
      })
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw ValidationError if user exceeds project limit", async () => {
    const now = new Date();
    const user = new User(
      "user-id",
      "john@example.com",
      "John Doe",
      "hashed",
      "OWNER",
      now,
      now
    );
    mockUserRepository.findById.mockResolvedValue(user);

    const existingProjects = Array(10)
      .fill(null)
      .map(
        (_, i) =>
          new Project(
            `project-${i}`,
            `Project ${i}`,
            "Description",
            "user-id",
            now,
            now
          )
      );
    mockProjectRepository.findByOwnerId.mockResolvedValue(existingProjects);

    await expect(
      createProject.execute({
        name: "New Project",
        description: "Description",
        ownerId: "user-id",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should successfully create a project", async () => {
    const now = new Date();
    const user = new User(
      "user-id",
      "john@example.com",
      "John Doe",
      "hashed",
      "OWNER",
      now,
      now
    );
    mockUserRepository.findById.mockResolvedValue(user);
    mockProjectRepository.findByOwnerId.mockResolvedValue([]);

    const savedProject = new Project(
      "project-id",
      "Test Project",
      "Test description",
      "user-id",
      now,
      now
    );
    mockProjectRepository.create.mockResolvedValue(savedProject);

    const result = await createProject.execute({
      name: "Test Project",
      description: "Test description",
      ownerId: "user-id",
    });

    expect(result).toBeDefined();
    expect(result.name).toBe("Test Project");
    expect(mockProjectRepository.create).toHaveBeenCalled();
    expect(mockCacheService.delete).toHaveBeenCalledWith("projects:user-id");
  });
});
