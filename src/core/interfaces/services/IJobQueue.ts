import { Job } from "../../entities/Job.js";

export interface IJobQueue {
  addJob(job: Job): Promise<void>;
  processJobs(): void;
}
