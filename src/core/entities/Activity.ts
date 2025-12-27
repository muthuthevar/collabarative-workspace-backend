export type ActivityType =
  | "USER_JOINED"
  | "USER_LEFT"
  | "FILE_CHANGED"
  | "CURSOR_MOVED";

export class Activity {
  constructor(
    public readonly id: string,
    public projectId: string,
    public userId: string,
    public type: ActivityType,
    public payload: any,
    public readonly timestamp: Date
  ) {}
}
