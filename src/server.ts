import express from "express";
import { Container } from "./infrastructure/di/container.js";
import { createAuthRoutes } from "./infrastructure/http/routes/authRoutes.js";
import { createProjectRoutes } from "./infrastructure/http/routes/projectRoutes.js";
import { createWorkspaceRoutes } from "./infrastructure/http/routes/workspaceRoutes.js";
import { createMemberRoutes } from "./infrastructure/http/routes/memberRoutes.js";
import { createJobRoutes } from "./infrastructure/http/routes/jobRoutes.js";
import { createCollaborationRoutes } from "./infrastructure/http/routes/collaborationRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Initialize DI Container
const container = new Container();

// Routes
app.use("/api/auth", createAuthRoutes(container.authController));
app.use(
  "/api/projects",
  createProjectRoutes(container.projectController, container.authMiddleware)
);
app.use(
  "/api/workspaces",
  createWorkspaceRoutes(container.workspaceController, container.authMiddleware)
);
app.use(
  "/api/members",
  createMemberRoutes(container.memberController, container.authMiddleware)
);
app.use(
  "/api/jobs",
  createJobRoutes(container.jobController, container.authMiddleware)
);
app.use(
  "/api/collaboration",
  createCollaborationRoutes(
    container.collaborationController,
    container.authMiddleware
  )
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    container.logger.error("Unhandled error", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   - POST   /api/auth/register`);
  console.log(`   - POST   /api/auth/login`);
  console.log(`   - POST   /api/auth/refresh`);
  console.log(`   - GET    /api/auth/validate`);
  console.log(`   - POST   /api/projects`);
  console.log(`   - GET    /api/projects`);
  console.log(`   - GET    /api/projects/:id`);
  console.log(`   - PUT    /api/projects/:id`);
  console.log(`   - DELETE /api/projects/:id`);
  console.log(`   - POST   /api/workspaces`);
  console.log(`   - GET    /api/workspaces/project/:projectId`);
  console.log(`   - POST   /api/members/invite`);
  console.log(`   - GET    /api/members/project/:projectId`);
  console.log(`   - POST   /api/jobs`);
  console.log(`   - GET    /api/jobs/:id`);
  console.log(`   - POST   /api/collaboration/broadcast`);
  console.log(`   - GET    /api/collaboration/history/:projectId`);
  console.log(`   - GET    /health`);
});

export default app;
