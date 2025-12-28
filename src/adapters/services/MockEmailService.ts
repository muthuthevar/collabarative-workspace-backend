import type { IEmailService } from "../../core/interfaces/services/IEmailService.js";
import type { ILogger } from "../../core/interfaces/ILogger.js";

export class MockEmailService implements IEmailService {
  constructor(private logger: ILogger) {}

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // Mock implementation - just log
    this.logger.info("Email sent", { to, subject, body });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  }

  async sendInvitationEmail(
    to: string,
    projectName: string,
    inviteLink: string
  ): Promise<void> {
    const subject = `You've been invited to ${projectName}`;
    const body = `
      You have been invited to collaborate on ${projectName}.
      
      Click the link below to join:
      ${inviteLink}
      
      Happy collaborating!
    `;

    await this.sendEmail(to, subject, body);
  }
}
