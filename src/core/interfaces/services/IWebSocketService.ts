export interface IwebSocketService {
  broadcast(event: string, data: any, room?: string): void;
  sendToUser(userId: string, event: string, data: any): void;
}
