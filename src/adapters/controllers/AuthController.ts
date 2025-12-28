import type { Request, Response } from "express";
import type { RegisterUser } from "../../use-cases/auth/RegisterUser.js";
import type { LoginUser } from "../../use-cases/auth/LoginUser.js";
import type { RefreshToken } from "../../use-cases/auth/RefreshToken.js";
import type { ValidateToken } from "../../use-cases/auth/ValidateToken.js";
import { AppError } from "../../core/errors/AppError.js";

export class AuthController {
  constructor(
    private registerUser: RegisterUser,
    private loginUser: LoginUser,
    private refreshToken: RefreshToken,
    private validateToken: ValidateToken
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role } = req.body;

      const result = await this.registerUser.execute({
        name,
        email,
        password,
        role: role || "COLLABORATOR",
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await this.loginUser.execute({ email, password });

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const result = await this.refreshToken.execute({ refreshToken });

      res.status(200).json({
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  async validate(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        res.status(401).json({
          success: false,
          error: "No token provided",
        });
        return;
      }

      const result = await this.validateToken.execute({ token });

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: result.id,
            name: result.name,
            email: result.email,
            role: result.role,
          },
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
