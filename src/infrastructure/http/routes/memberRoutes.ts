import { Router } from "express";
import type { MemberController } from "../../../adapters/controllers/MemberController.js";
import type { AuthMiddleware } from "../middleware/authMiddleware.js";

export function createMemberRoutes(
  memberController: MemberController,
  authMiddleware: AuthMiddleware
): Router {
  const router = Router();

  router.use(authMiddleware.authenticate());

  router.post("/invite", (req, res) => memberController.invite(req, res));
  router.get("/project/:projectId", (req, res) =>
    memberController.list(req, res)
  );

  return router;
}
