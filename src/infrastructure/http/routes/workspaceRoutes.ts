import { Router } from "express";
import type { WorkspaceController } from "../../../adapters/controllers/WorkspaceController.js";
import type { AuthMiddleware } from "../middleware/authMiddleware.js";

export function createWorkspaceRoutes(
  workspaceController: WorkspaceController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  router.use(authMiddleware.authenticate());

  router.post("/", (req, res) => workspaceController.create(req, res));
  router.get("/project/:projectId", (req, res) =>
    workspaceController.list(req, res)
  );

  return router;
}
