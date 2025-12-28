import { Router } from "express";
import type { CollaborationController } from "../../../adapters/controllers/CollaborationController.js";
import type { AuthMiddleware } from "../middleware/authMiddleware.js";

export function createCollaborationRoutes(
  collaborationController: CollaborationController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  router.use(authMiddleware.authenticate());

  router.post("/broadcast", (req, res) =>
    collaborationController.broadcast(req, res)
  );
  router.get("/history/:projectId", (req, res) =>
    collaborationController.getHistory(req, res)
  );

  return router;
}
