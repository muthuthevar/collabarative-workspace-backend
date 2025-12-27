import { User } from "../../core/entities/User.js";
import type { IUserRepository } from "../../core/interfaces/repositories/IUserRepository.js";
import type { IAuthService } from "../../core/interfaces/services/IAuthService.js";
import {
  UnauthorizedError,
  ValidationError,
} from "../../core/errors/AppError.js";

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class LoginUser {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(dto: LoginUserDTO): Promise<LoginUserResponse> {
    // Validate input
    if (!dto.email || !dto.password) {
      throw new ValidationError("Email and password are required");
    }

    // Find user
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase());
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await this.authService.comparePassword(
      dto.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Generate tokens
    const accessToken = await this.authService.generateToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
