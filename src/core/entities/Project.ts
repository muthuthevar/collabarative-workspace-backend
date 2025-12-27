export class Project {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public ownerId: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  isOwner(userId: string): boolean {
    return this.ownerId === userId;
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }
}
