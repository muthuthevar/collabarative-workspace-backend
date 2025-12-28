import type { IJobQueue } from "../../core/interfaces/services/IJobQueue.js";
import type { Job } from "../../core/entities/Job.js";
import type { ILogger } from "../../core/interfaces/ILogger.js";

export class MockJobQueue implements IJobQueue {
  constructor(private logger: ILogger) {}

  async addJob(job: Job): Promise<void> {
    this.logger.info("Job added to queue", { jobId: job.id, type: job.type });
    console.log(`⚙️ Job ${job.id} (${job.type}) added to queue`);
  }

  processJobs(): void {
    this.logger.info("Job processing started");
    console.log("⚙️ Job processing started");
  }
}
