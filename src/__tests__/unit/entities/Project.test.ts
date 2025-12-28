import { Project } from "../../../core/entities/Project.js";

describe("Project Entity", () => {
  it("should create a project with all properties", () => {
    const now = new Date();
    const project = new Project(
      "project-id",
      "Test Project",
      "Test description",
      "owner-id",
      now,
      now
    );

    expect(project.id).toBe("project-id");
    expect(project.name).toBe("Test Project");
    expect(project.description).toBe("Test description");
    expect(project.ownerId).toBe("owner-id");
    expect(project.createdAt).toBeInstanceOf(Date);
    expect(project.updatedAt).toBeInstanceOf(Date);
  });

  it("should check if user is owner", () => {
    const now = new Date();
    const project = new Project(
      "project-id",
      "Test Project",
      "Description",
      "owner-id",
      now,
      now
    );

    expect(project.isOwner("owner-id")).toBe(true);
    expect(project.isOwner("other-user-id")).toBe(false);
  });

  it("should update project name", () => {
    const now = new Date();
    const project = new Project(
      "project-id",
      "Old Name",
      "Description",
      "owner-id",
      now,
      now
    );

    project.updateName("New Name");

    expect(project.name).toBe("New Name");
    expect(project.updatedAt.getTime()).toBeGreaterThan(now.getTime());
  });

  it("should update project description", () => {
    const now = new Date();
    const project = new Project(
      "project-id",
      "Name",
      "Old Description",
      "owner-id",
      now,
      now
    );

    project.updateDescription("New Description");

    expect(project.description).toBe("New Description");
    expect(project.updatedAt.getTime()).toBeGreaterThan(now.getTime());
  });
});
