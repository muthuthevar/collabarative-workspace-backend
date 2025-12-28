import request from "supertest";
import express from "express";
import type { Express } from "express";
import { Container } from "../../infrastructure/di/container.js";
import { createAuthRoutes } from "../../infrastructure/http/routes/authRoutes.js";

describe("Authentication API Integration Tests", () => {
  let app: Express;
  let container: Container;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    container = new Container();
    const authRoutes = createAuthRoutes(container.authController);
    app.use("/api/auth", authRoutes);
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: `test${Date.now()}@example.com`,
          password: "SecurePass123!",
          role: "OWNER",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should return 409 for duplicate email", async () => {
      const email = `duplicate${Date.now()}@example.com`;

      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email,
        password: "SecurePass123!",
      });

      const response = await request(app).post("/api/auth/register").send({
        name: "Test User 2",
        email,
        password: "SecurePass123!",
      });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it("should return 400 for invalid email", async () => {
      const response = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "invalid-email",
        password: "SecurePass123!",
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    const testEmail = `login${Date.now()}@example.com`;
    const testPassword = "SecurePass123!";

    beforeAll(async () => {
      await request(app).post("/api/auth/register").send({
        name: "Login Test User",
        email: testEmail,
        password: testPassword,
      });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testEmail,
        password: testPassword,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should return 401 for incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testEmail,
        password: "WrongPassword123!",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should return 404 for non-existent user", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: testPassword,
      });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/refresh", () => {
    let refreshToken: string;

    beforeAll(async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Refresh Test User",
          email: `refresh${Date.now()}@example.com`,
          password: "SecurePass123!",
        });

      refreshToken = response.body.data.refreshToken;
    });

    it("should refresh token successfully", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it("should return 401 for invalid refresh token", async () => {
      const response = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: "invalid-token" });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/validate", () => {
    let accessToken: string;

    beforeAll(async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Validate Test User",
          email: `validate${Date.now()}@example.com`,
          password: "SecurePass123!",
        });

      accessToken = response.body.data.accessToken;
    });

    it("should validate token successfully", async () => {
      const response = await request(app)
        .get("/api/auth/validate")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
    });

    it("should return 401 for missing token", async () => {
      const response = await request(app).get("/api/auth/validate");

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
