export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string,
    public passwordHash: string,
    public role: "OWNER" | "COLLABORATOR" | "VIEWER",
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  canEdit(): boolean {
    return this.role === "OWNER" || this.role === "COLLABORATOR";
  }

  canDelete(): boolean {
    return this.role === "OWNER";
  }

  canInvite(): boolean {
    return this.role === "OWNER";
  }

  updateEmail(email: string): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }
}
