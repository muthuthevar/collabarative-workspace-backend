import type { IUserRepository } from "../../core/interfaces/repositories/IUserRepository.js";
import type { IAuthService } from "../../core/interfaces/services/IAuthService.js";
import {
  UnauthorizedError,
  NotFoundError,
} from "../../core/errors/AppError.js";

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class RefreshToken {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(dto: RefreshTokenDTO): Promise<RefreshTokenResponse> {
    // Verify refresh token
    const payload = await this.authService.verifyRefreshToken(dto.refreshToken);
    if (!payload) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }

    // Check if user still exists
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Generate new tokens
    const accessToken = await this.authService.generateToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }
}
