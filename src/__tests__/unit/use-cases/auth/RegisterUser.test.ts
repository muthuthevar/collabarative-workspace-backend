import { RegisterUser } from "../../../../use-cases/auth/RegisterUser.js";
import { User } from "../../../../core/entities/User.js";
import type { IUserRepository } from "../../../../core/interfaces/repositories/IUserRepository.js";
import type { IAuthService } from "../../../../core/interfaces/services/IAuthService.js";
import {
  ValidationError,
  ConflictError,
} from "../../../../core/errors/AppError.js";

describe("RegisterUser Use Case", () => {
  let registerUser: RegisterUser;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
      generateToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    };

    registerUser = new RegisterUser(mockUserRepository, mockAuthService);
  });

  describe("Validation", () => {
    it("should throw ValidationError for invalid email", async () => {
      await expect(
        registerUser.execute({
          email: "invalid-email",
          password: "SecurePass123!",
          name: "John Doe",
        })
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError for short password", async () => {
      await expect(
        registerUser.execute({
          email: "john@example.com",
          password: "short",
          name: "John Doe",
        })
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ValidationError for short name", async () => {
      await expect(
        registerUser.execute({
          email: "john@example.com",
          password: "SecurePass123!",
          name: "J",
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("User Registration", () => {
    it("should throw ConflictError if user already exists", async () => {
      const now = new Date();
      const existingUser = new User(
        "user-id",
        "john@example.com",
        "John Doe",
        "hashed-password",
        "OWNER",
        now,
        now
      );

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(
        registerUser.execute({
          email: "john@example.com",
          password: "SecurePass123!",
          name: "John Doe",
        })
      ).rejects.toThrow(ConflictError);
    });

    it("should successfully register a new user", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockAuthService.hashPassword.mockResolvedValue("hashed-password");
      mockAuthService.generateToken.mockResolvedValue("access-token");
      mockAuthService.generateRefreshToken.mockResolvedValue("refresh-token");

      const now = new Date();
      const savedUser = new User(
        "new-user-id",
        "john@example.com",
        "John Doe",
        "hashed-password",
        "COLLABORATOR",
        now,
        now
      );
      mockUserRepository.create.mockResolvedValue(savedUser);

      const result = await registerUser.execute({
        email: "john@example.com",
        password: "SecurePass123!",
        name: "John Doe",
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe("john@example.com");
      expect(result.accessToken).toBe("access-token");
      expect(result.refreshToken).toBe("refresh-token");
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it("should use provided role when registering", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockAuthService.hashPassword.mockResolvedValue("hashed-password");
      mockAuthService.generateToken.mockResolvedValue("access-token");
      mockAuthService.generateRefreshToken.mockResolvedValue("refresh-token");

      const now = new Date();
      const savedUser = new User(
        "new-user-id",
        "john@example.com",
        "John Doe",
        "hashed-password",
        "OWNER",
        now,
        now
      );
      mockUserRepository.create.mockResolvedValue(savedUser);

      const result = await registerUser.execute({
        email: "john@example.com",
        password: "SecurePass123!",
        name: "John Doe",
        role: "OWNER",
      });

      expect(result.user.role).toBe("OWNER");
    });
  });
});
