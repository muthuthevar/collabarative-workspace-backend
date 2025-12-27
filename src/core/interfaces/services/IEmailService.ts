export interface IEmailService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendInvitationEmail(
    to: string,
    projectName: string,
    inviteLink: string
  ): Promise<void>;
}
