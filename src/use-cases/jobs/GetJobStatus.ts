import { Job } from "../../core/entities/Job.js";
import type { IJobRepository } from "../../core/interfaces/repositories/IJobRepository.js";
import { NotFoundError } from "../../core/errors/AppError.js";

export interface GetJobStatusDTO {
  jobId: string;
}

export class GetJobStatus {
  constructor(private jobRepository: IJobRepository) {}

  async execute(dto: GetJobStatusDTO): Promise<Job> {
    const job = await this.jobRepository.findById(dto.jobId);
    if (!job) {
      throw new NotFoundError("Job not found");
    }

    return job;
  }
}
