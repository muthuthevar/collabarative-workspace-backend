import type { Request, Response } from "express";
import type { InviteMember } from "../../use-cases/members/InviteMember.js";
import type { ListMembers } from "../../use-cases/members/ListMembers.js";
import { AppError } from "../../core/errors/AppError.js";

export class MemberController {
  constructor(
    private inviteMember: InviteMember,
    private listMembers: ListMembers
  ) {}

  async invite(req: Request, res: Response): Promise<void> {
    try {
      const { projectId, userEmail, role } = req.body;
      const inviterId = (req as any).user?.id;

      const member = await this.inviteMember.execute({
        projectId,
        inviterId,
        userEmail,
        role,
      });

      res.status(201).json({
        success: true,
        data: {
          id: member.id,
          projectId: member.projectId,
          userId: member.userId,
          role: member.role,
          invitedBy: member.invitedBy,
          joinedAt: member.joinedAt,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = (req as any).user?.id;

      if (!projectId) {
        res.status(400).json({ success: false, error: "Project ID required" });
        return;
      }

      const members = await this.listMembers.execute({
        projectId,
        userId,
      });

      res.status(200).json({
        success: true,
        data: members.map((m) => ({
          id: m.id,
          projectId: m.projectId,
          userId: m.userId,
          role: m.role,
          invitedBy: m.invitedBy,
          joinedAt: m.joinedAt,
        })),
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
