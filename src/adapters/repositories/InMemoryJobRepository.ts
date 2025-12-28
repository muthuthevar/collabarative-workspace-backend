import type { Job } from "../../core/entities/Job.js";
import type { IJobRepository } from "../../core/interfaces/repositories/IJobRepository.js";

export class InMemoryJobRepository implements IJobRepository {
  private jobs: Map<string, Job> = new Map();

  async create(job: Job): Promise<Job> {
    this.jobs.set(job.id, job);
    return job;
  }

  async findById(id: string): Promise<Job | null> {
    return this.jobs.get(id) || null;
  }

  async update(job: Job): Promise<Job> {
    this.jobs.set(job.id, job);
    return job;
  }
}
