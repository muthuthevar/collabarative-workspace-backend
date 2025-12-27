import { Activity } from "../../entities/Activity.js";

export interface IActivityRepository {
  create(activity: Activity): Promise<Activity>;
  findByProjectId(projectId: string, limit?: number): Promise<Activity[]>;
  findByUserId(userId: string, limit?: number): Promise<Activity[]>;
}
