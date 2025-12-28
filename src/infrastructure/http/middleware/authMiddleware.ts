import type { Request, Response, NextFunction } from "express";
import type { IAuthService } from "../../../core/interfaces/services/IAuthService.js";
import type { IUserRepository } from "../../../core/interfaces/repositories/IUserRepository.js";

export class AuthMiddleware {
  constructor(
    private authService: IAuthService,
    private userRepository: IUserRepository
  ) {}

  authenticate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
          res.status(401).json({
            success: false,
            error: "No token provided",
          });
          return;
        }

        const payload = await this.authService.verifyToken(token);

        if (!payload) {
          res.status(401).json({
            success: false,
            error: "Invalid or expired token",
          });
          return;
        }

        const user = await this.userRepository.findById(payload.userId);

        if (!user) {
          res.status(401).json({
            success: false,
            error: "User not found",
          });
          return;
        }

        (req as any).user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };

        next();
      } catch (error) {
        res.status(401).json({
          success: false,
          error: "Authentication failed",
        });
      }
    };
  }
}
