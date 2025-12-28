import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { Container } from "./infrastructure/di/container.js";
import { createAuthRoutes } from "./infrastructure/http/routes/authRoutes.js";
import { createProjectRoutes } from "./infrastructure/http/routes/projectRoutes.js";
import { createWorkspaceRoutes } from "./infrastructure/http/routes/workspaceRoutes.js";
import { createMemberRoutes } from "./infrastructure/http/routes/memberRoutes.js";
import { createJobRoutes } from "./infrastructure/http/routes/jobRoutes.js";
import { createCollaborationRoutes } from "./infrastructure/http/routes/collaborationRoutes.js";
import {
  generalLimiter,
  authLimiter,
  apiLimiter,
} from "./infrastructure/http/middleware/rateLimitMiddleware.js";
import { sanitizeInput } from "./infrastructure/http/middleware/validationMiddleware.js";
import { setupSwagger } from "./infrastructure/docs/swagger.js";
import {
  metricsMiddleware,
  getMetrics,
} from "./infrastructure/monitoring/metrics.js";

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for Swagger UI
  })
);

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Input Sanitization
app.use(sanitizeInput);

// Metrics Middleware
app.use(metricsMiddleware);

// General Rate Limiting
app.use(generalLimiter);

// Initialize DI Container
const container = new Container();

// Initialize WebSocket
if (container.webSocketService && "initialize" in container.webSocketService) {
  (container.webSocketService as any).initialize(httpServer);
  container.logger.info("WebSocket service initialized");
}

// Setup Swagger Documentation
setupSwagger(app);
container.logger.info("API documentation available at /api-docs");

// Routes
app.use("/api/auth", authLimiter, createAuthRoutes(container.authController));
app.use(
  "/api/projects",
  apiLimiter,
  createProjectRoutes(container.projectController, container.authMiddleware)
);
app.use(
  "/api/workspaces",
  apiLimiter,
  createWorkspaceRoutes(container.workspaceController, container.authMiddleware)
);
app.use(
  "/api/members",
  apiLimiter,
  createMemberRoutes(container.memberController, container.authMiddleware)
);
app.use(
  "/api/jobs",
  apiLimiter,
  createJobRoutes(container.jobController, container.authMiddleware)
);
app.use(
  "/api/collaboration",
  apiLimiter,
  createCollaborationRoutes(
    container.collaborationController,
    container.authMiddleware
  )
);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Metrics endpoint for Prometheus
app.get("/metrics", getMetrics);

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
httpServer.listen(PORT, () => {
  container.logger.info(`🚀 Server running on http://localhost:${PORT}`);
  container.logger.info(
    `📚 API Documentation: http://localhost:${PORT}/api-docs`
  );
  container.logger.info(`📊 Metrics: http://localhost:${PORT}/metrics`);
  container.logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
  container.logger.info(`🔌 WebSocket: ws://localhost:${PORT}`);
  container.logger.info(
    `Environment: ${process.env.NODE_ENV || "development"}`
  );

  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`📊 Metrics: http://localhost:${PORT}/metrics`);
  console.log(`💚 Health: http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  container.logger.info("SIGTERM signal received: closing HTTP server");
  httpServer.close(() => {
    container.logger.info("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  container.logger.info("SIGINT signal received: closing HTTP server");
  httpServer.close(() => {
    container.logger.info("HTTP server closed");
    process.exit(0);
  });
});

export default app;
