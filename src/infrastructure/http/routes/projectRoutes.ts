import { Router } from "express";
import type { ProjectController } from "../../../adapters/controllers/ProjectController.js";
import type { AuthMiddleware } from "../middleware/authMiddleware.js";

export function createProjectRoutes(
  projectController: ProjectController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  router.use(authMiddleware.authenticate());

  router.post("/", (req, res) => projectController.create(req, res));
  router.get("/", (req, res) => projectController.list(req, res));
  router.get("/:id", (req, res) => projectController.get(req, res));
  router.put("/:id", (req, res) => projectController.update(req, res));
  router.delete("/:id", (req, res) => projectController.delete(req, res));

  return router;
}
