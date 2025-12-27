import type { Job, JobStatus, JobType } from "../../entities/Job.js";

export interface IJobRepository {
  create(job: Job): Promise<Job>;
  findById(id: string): Promise<Job | null>;
  findAll(filters?: { status?: JobStatus; type?: JobType }): Promise<Job[]>;
  update(job: Job): Promise<Job>;
}
