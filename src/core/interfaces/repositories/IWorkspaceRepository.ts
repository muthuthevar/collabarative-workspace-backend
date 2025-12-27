import { Workspace } from "../../entities/Workspace.js";

export interface IWorkspaceRepository {
  create(workspace: Workspace): Promise<Workspace>;
  findById(id: string): Promise<Workspace | null>;
  findByProjectId(projectId: string): Promise<Workspace[]>;
  update(workspace: Workspace): Promise<Workspace>;
  delete(id: string): Promise<void>;
}
