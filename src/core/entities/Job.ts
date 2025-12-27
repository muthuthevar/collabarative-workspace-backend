export type JobStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
export type JobType = "CODE_EXECUTION" | "FILE_PROCESSING" | "NOTIFICATION";

export class Job {
  constructor(
    public readonly id: string,
    public type: JobType,
    public payload: any,
    public status: JobStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public retryCount: number = 0,
    public result?: any,
    public error?: string,
    public completedAt?: Date
  ) {}

  isCompleted(): boolean {
    return this.status === "COMPLETED";
  }

  isFailed(): boolean {
    return this.status === "FAILED";
  }

  canRetry(): boolean {
    return this.status === "FAILED" && this.retryCount < 3;
  }

  markAsRunning(): void {
    this.status = "RUNNING";
    this.updatedAt = new Date();
  }

  markAsCompleted(result: any): void {
    this.status = "COMPLETED";
    this.result = result;
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  markAsFailed(error: string): void {
    this.status = "FAILED";
    this.error = error;
    this.updatedAt = new Date();
  }

  incrementRetry(): void {
    this.retryCount += 1;
    this.status = "PENDING";
    this.updatedAt = new Date();
  }
}
