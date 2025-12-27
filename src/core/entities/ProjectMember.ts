export class ProjectMember {
  constructor(
    public readonly id: string,
    public projectId: string,
    public userId: string,
    public role: "OWNER" | "COLLABORATOR" | "VIEWER",
    public invitedBy: string,
    public readonly joinedAt: Date
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
  updateRole(role: "OWNER" | "COLLABORATOR" | "VIEWER"): void {
    this.role = role;
  }
}
