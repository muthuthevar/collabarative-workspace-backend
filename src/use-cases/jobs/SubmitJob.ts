import { Job, type JobType } from "../../core/entities/Job.js";
import type { IJobRepository } from "../../core/interfaces/repositories/IJobRepository.js";
import type { IJobQueue } from "../../core/interfaces/services/IJobQueue.js";
import { ValidationError } from "../../core/errors/AppError.js";
import { v4 as uuidv4 } from "uuid";

export interface SubmitJobDTO {
  type: JobType;
  payload: any;
}

export class SubmitJob {
  constructor(
    private jobRepository: IJobRepository,
    private jobQueue: IJobQueue
  ) {}

  async execute(dto: SubmitJobDTO): Promise<Job> {
    // Validate job type
    const validTypes: JobType[] = [
      "CODE_EXECUTION",
      "FILE_PROCESSING",
      "NOTIFICATION",
    ];
    if (!validTypes.includes(dto.type)) {
      throw new ValidationError("Invalid job type");
    }

    // Validate payload
    if (!dto.payload) {
      throw new ValidationError("Job payload is required");
    }

    // Create job
    const job = new Job(
      uuidv4(),
      dto.type,
      dto.payload,
      "PENDING",
      new Date(),
      new Date()
    );

    // Save to database
    await this.jobRepository.create(job);

    // Add to queue
    await this.jobQueue.addJob(job);

    return job;
  }
}
