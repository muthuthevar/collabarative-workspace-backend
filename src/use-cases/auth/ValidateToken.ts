import { User } from "../../core/entities/User.js";
import type { IUserRepository } from "../../core/interfaces/repositories/IUserRepository.js";
import type { IAuthService } from "../../core/interfaces/services/IAuthService.js";
import {
  UnauthorizedError,
  NotFoundError,
} from "../../core/errors/AppError.js";

export interface ValidateTokenDTO {
  token: string;
}

export class ValidateToken {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(dto: ValidateTokenDTO): Promise<User> {
    // Verify token
    const payload = await this.authService.verifyToken(dto.token);
    if (!payload) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    // Get user
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }
}
