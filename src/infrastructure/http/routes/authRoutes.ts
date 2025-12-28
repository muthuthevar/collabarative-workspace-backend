import { Router } from "express";
import type { AuthController } from "../../../adapters/controllers/AuthController.js";

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  router.post("/register", (req, res) => authController.register(req, res));
  router.post("/login", (req, res) => authController.login(req, res));
  router.post("/refresh", (req, res) => authController.refresh(req, res));
  router.get("/validate", (req, res) => authController.validate(req, res));

  return router;
}
