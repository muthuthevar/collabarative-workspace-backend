import type { Request, Response } from "express";
import type { SubmitJob } from "../../use-cases/jobs/SubmitJob.js";
import type { GetJobStatus } from "../../use-cases/jobs/GetJobStatus.js";
import { AppError } from "../../core/errors/AppError.js";

export class JobController {
  constructor(
    private submitJob: SubmitJob,
    private getJobStatus: GetJobStatus
  ) {}

  async submit(req: Request, res: Response): Promise<void> {
    try {
      const { type, payload } = req.body;

      const job = await this.submitJob.execute({ type, payload });

      res.status(201).json({
        success: true,
        data: {
          id: job.id,
          type: job.type,
          status: job.status,
          createdAt: job.createdAt,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ success: false, error: "Job ID required" });
        return;
      }

      const job = await this.getJobStatus.execute({ jobId: id });

      res.status(200).json({
        success: true,
        data: {
          id: job.id,
          type: job.type,
          status: job.status,
          result: job.result,
          error: job.error,
          retryCount: job.retryCount,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
          completedAt: job.completedAt,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
