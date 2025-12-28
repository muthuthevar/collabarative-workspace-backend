import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { IAuthService } from "../../core/interfaces/services/IAuthService.js";

export class JwtAuthService implements IAuthService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly jwtRefreshExpiresIn: string;
  private readonly bcryptRounds: number;

  constructor() {
    this.jwtSecret =
      process.env.JWT_SECRET || "your-secret-key-change-in-production";
    this.jwtRefreshSecret =
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.bcryptRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as any);
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, this.jwtRefreshSecret, {
      expiresIn: this.jwtRefreshExpiresIn,
    } as any);
  }

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as { userId: string };
      return payload;
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
    try {
      const payload = jwt.verify(token, this.jwtRefreshSecret) as {
        userId: string;
      };
      return payload;
    } catch (error) {
      return null;
    }
  }
}
