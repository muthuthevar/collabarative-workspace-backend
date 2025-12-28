import { User } from "../../../core/entities/User.js";

describe("User Entity", () => {
  it("should create a user with all properties", () => {
    const now = new Date();
    const user = new User(
      "user-id",
      "john@example.com",
      "John Doe",
      "hashed-password",
      "OWNER",
      now,
      now
    );

    expect(user.id).toBe("user-id");
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john@example.com");
    expect(user.passwordHash).toBe("hashed-password");
    expect(user.role).toBe("OWNER");
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it("should have timestamps", () => {
    const now = new Date();
    const user = new User(
      "user-id",
      "john@example.com",
      "John Doe",
      "hashed-password",
      "OWNER",
      now,
      now
    );

    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
    expect(user.updatedAt.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("should support different roles", () => {
    const now = new Date();
    const owner = new User(
      "1",
      "owner@example.com",
      "Owner",
      "hash",
      "OWNER",
      now,
      now
    );
    const collaborator = new User(
      "2",
      "collab@example.com",
      "Collab",
      "hash",
      "COLLABORATOR",
      now,
      now
    );
    const viewer = new User(
      "3",
      "viewer@example.com",
      "Viewer",
      "hash",
      "VIEWER",
      now,
      now
    );

    expect(owner.role).toBe("OWNER");
    expect(collaborator.role).toBe("COLLABORATOR");
    expect(viewer.role).toBe("VIEWER");
  });

  it("should check if user can edit", () => {
    const now = new Date();
    const owner = new User(
      "1",
      "owner@example.com",
      "Owner",
      "hash",
      "OWNER",
      now,
      now
    );
    const collaborator = new User(
      "2",
      "collab@example.com",
      "Collab",
      "hash",
      "COLLABORATOR",
      now,
      now
    );
    const viewer = new User(
      "3",
      "viewer@example.com",
      "Viewer",
      "hash",
      "VIEWER",
      now,
      now
    );

    expect(owner.canEdit()).toBe(true);
    expect(collaborator.canEdit()).toBe(true);
    expect(viewer.canEdit()).toBe(false);
  });

  it("should check if user can delete", () => {
    const now = new Date();
    const owner = new User(
      "1",
      "owner@example.com",
      "Owner",
      "hash",
      "OWNER",
      now,
      now
    );
    const collaborator = new User(
      "2",
      "collab@example.com",
      "Collab",
      "hash",
      "COLLABORATOR",
      now,
      now
    );

    expect(owner.canDelete()).toBe(true);
    expect(collaborator.canDelete()).toBe(false);
  });

  it("should check if user can invite", () => {
    const now = new Date();
    const owner = new User(
      "1",
      "owner@example.com",
      "Owner",
      "hash",
      "OWNER",
      now,
      now
    );
    const collaborator = new User(
      "2",
      "collab@example.com",
      "Collab",
      "hash",
      "COLLABORATOR",
      now,
      now
    );

    expect(owner.canInvite()).toBe(true);
    expect(collaborator.canInvite()).toBe(false);
  });
});
