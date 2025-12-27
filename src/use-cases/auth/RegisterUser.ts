import { User } from "../../core/entities/User.js";
import type { IUserRepository } from "../../core/interfaces/repositories/IUserRepository.js";
import type { IAuthService } from "../../core/interfaces/services/IAuthService.js";
import { ValidationError, ConflictError } from "../../core/errors/AppError.js";
import { v4 as uuidv4 } from "uuid";

export interface RegisterUserDTO {
  email: string;
  password: string;
  name: string;
}

export interface RegisterUserResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(dto: RegisterUserDTO): Promise<RegisterUserResponse> {
    // Validate email
    if (!dto.email || !this.isValidEmail(dto.email)) {
      throw new ValidationError("Invalid email address");
    }

    // Validate password
    if (!dto.password || dto.password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters");
    }

    // Validate name
    if (!dto.name || dto.name.trim().length < 2) {
      throw new ValidationError("Name must be at least 2 characters");
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    // Hash password
    const passwordHash = await this.authService.hashPassword(dto.password);

    // Create user entity
    const user = new User(
      uuidv4(),
      dto.email.toLowerCase(),
      dto.name.trim(),
      passwordHash,
      "OWNER",
      new Date(),
      new Date()
    );

    // Save to database
    await this.userRepository.create(user);

    // Generate tokens
    const accessToken = await this.authService.generateToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
