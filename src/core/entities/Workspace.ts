export class Workspace {
  constructor(
    public readonly id: string,
    public projectId: string,
    public name: string,
    public settings: Record<string, any>,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  updateSettings(settings: Record<string, any>): void {
    this.settings = { ...this.settings, ...settings };
    this.updatedAt = new Date();
  }
}
