import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Collaborative Workspace API",
      version: "1.0.0",
      description:
        "Production-grade real-time collaborative workspace backend API",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["OWNER", "COLLABORATOR", "VIEWER"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Project: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string" },
            ownerId: { type: "string", format: "uuid" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Workspace: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            projectId: { type: "string", format: "uuid" },
            name: { type: "string" },
            type: {
              type: "string",
              enum: ["DOCUMENT", "SPREADSHEET", "PRESENTATION", "CODE"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Job: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            type: {
              type: "string",
              enum: ["EXPORT", "IMPORT", "ANALYSIS", "REPORT"],
            },
            status: {
              type: "string",
              enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
            },
            payload: { type: "object" },
            result: { type: "object" },
            error: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string" },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "Authentication and authorization endpoints",
      },
      { name: "Projects", description: "Project management endpoints" },
      { name: "Workspaces", description: "Workspace management endpoints" },
      { name: "Members", description: "Team member management endpoints" },
      { name: "Jobs", description: "Asynchronous job processing endpoints" },
      {
        name: "Collaboration",
        description: "Real-time collaboration endpoints",
      },
      { name: "Health", description: "Health check and monitoring endpoints" },
    ],
  },
  apis: ["./src/infrastructure/docs/api-docs.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Collaborative Workspace API Docs",
    })
  );

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

export default swaggerSpec;
