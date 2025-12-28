import type { Activity } from "../../core/entities/Activity.js";
import type { IActivityRepository } from "../../core/interfaces/repositories/IActivityRepository.js";

export class InMemoryActivityRepository implements IActivityRepository {
  private activities: Activity[] = [];

  async create(activity: Activity): Promise<Activity> {
    this.activities.push(activity);
    return activity;
  }

  async findByProjectId(
    projectId: string,
    limit: number = 50
  ): Promise<Activity[]> {
    return this.activities
      .filter((a) => a.projectId === projectId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async findByUserId(userId: string, limit?: number): Promise<Activity[]> {
    return this.activities;
  }
}
