import { Router } from "express";
import type { JobController } from "../../../adapters/controllers/JobController.js";
import type { AuthMiddleware } from "../middleware/authMiddleware.js";

export function createJobRoutes(
  jobController: JobController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  router.use(authMiddleware.authenticate());

  router.post("/", (req, res) => jobController.submit(req, res));
  router.get("/:id", (req, res) => jobController.getStatus(req, res));

  return router;
}
