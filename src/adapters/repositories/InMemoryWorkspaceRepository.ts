import type { Workspace } from "../../core/entities/Workspace.js";
import type { IWorkspaceRepository } from "../../core/interfaces/repositories/IWorkspaceRepository.js";

export class InMemoryWorkspaceRepository implements IWorkspaceRepository {
  private workspaces: Map<string, Workspace> = new Map();

  async create(workspace: Workspace): Promise<Workspace> {
    this.workspaces.set(workspace.id, workspace);
    return workspace;
  }

  async findById(id: string): Promise<Workspace | null> {
    return this.workspaces.get(id) || null;
  }

  async findByProjectId(projectId: string): Promise<Workspace[]> {
    const result: Workspace[] = [];
    for (const workspace of this.workspaces.values()) {
      if (workspace.projectId === projectId) {
        result.push(workspace);
      }
    }
    return result;
  }

  async update(workspace: Workspace): Promise<Workspace> {
    this.workspaces.set(workspace.id, workspace);
    return workspace;
  }

  async delete(id: string): Promise<void> {
    this.workspaces.delete(id);
  }
}
