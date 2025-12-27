export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
  generateToken(userId: string): Promise<string>;
  generateRefreshToken(userId: string): Promise<string>;
  verifyToken(token: string): Promise<{ userId: string } | null>;
  verifyRefreshToken(token: string): Promise<{ userId: string } | null>;
}
