import { Activity, type ActivityType } from "../../core/entities/Activity.js";
import type { IActivityRepository } from "../../core/interfaces/repositories/IActivityRepository.js";
import type { IWebSocketService } from "../../core/interfaces/services/IWebSocketService.js";
import { ValidationError } from "../../core/errors/AppError.js";
import { v4 as uuidv4 } from "uuid";

export interface BroadcastEventDTO {
  projectId: string;
  userId: string;
  type: ActivityType;
  payload: any;
}

export class BroadcastEvent {
  constructor(
    private activityRepository: IActivityRepository,
    private webSocketService: IWebSocketService
  ) {}

  async execute(dto: BroadcastEventDTO): Promise<void> {
    // Validate activity type
    const validTypes: ActivityType[] = [
      "USER_JOINED",
      "USER_LEFT",
      "FILE_CHANGED",
      "CURSOR_MOVED",
    ];
    if (!validTypes.includes(dto.type)) {
      throw new ValidationError("Invalid activity type");
    }

    // Create activity
    const activity = new Activity(
      uuidv4(),
      dto.projectId,
      dto.userId,
      dto.type,
      dto.payload,
      new Date()
    );

    // Save to database (for history)
    await this.activityRepository.create(activity);

    // Broadcast to all users in project room
    this.webSocketService.broadcast(
      "activity",
      {
        id: activity.id,
        projectId: activity.projectId,
        userId: activity.userId,
        type: activity.type,
        payload: activity.payload,
        timestamp: activity.timestamp,
      },
      `project:${dto.projectId}`
    );
  }
}
