import type { Request, Response, NextFunction } from "express";
import { body, param, query, validationResult } from "express-validator";
import { ValidationError } from "../../../core/errors/AppError.js";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map(
        (err) =>
          `${err.type === "field" ? (err as any).path : "unknown"}: ${err.msg}`
      )
      .join(", ");

    res.status(400).json({
      success: false,
      error: errorMessages,
    });
    return;
  }
  next();
};

export const registerValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("role")
    .optional()
    .isIn(["OWNER", "COLLABORATOR", "VIEWER"])
    .withMessage("Role must be OWNER, COLLABORATOR, or VIEWER"),
  validate,
];

export const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

export const createProjectValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Project name must be between 1 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  validate,
];

export const updateProjectValidation = [
  param("id").isUUID().withMessage("Invalid project ID"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Project name must be between 1 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters"),
  validate,
];

export const projectIdValidation = [
  param("id").isUUID().withMessage("Invalid project ID"),
  validate,
];

export const createWorkspaceValidation = [
  body("projectId").isUUID().withMessage("Invalid project ID"),
  body("name")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Workspace name must be between 1 and 200 characters"),
  body("type")
    .optional()
    .isIn(["DOCUMENT", "SPREADSHEET", "PRESENTATION", "CODE"])
    .withMessage("Invalid workspace type"),
  validate,
];

export const inviteMemberValidation = [
  body("projectId").isUUID().withMessage("Invalid project ID"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("role")
    .isIn(["OWNER", "COLLABORATOR", "VIEWER"])
    .withMessage("Role must be OWNER, COLLABORATOR, or VIEWER"),
  validate,
];

export const submitJobValidation = [
  body("type")
    .isIn(["EXPORT", "IMPORT", "ANALYSIS", "REPORT"])
    .withMessage("Invalid job type"),
  body("payload").isObject().withMessage("Payload must be an object"),
  validate,
];

export const broadcastEventValidation = [
  body("projectId").isUUID().withMessage("Invalid project ID"),
  body("type")
    .isIn(["USER_JOINED", "USER_LEFT", "FILE_CHANGED", "CURSOR_MOVED"])
    .withMessage("Invalid activity type"),
  body("metadata")
    .optional()
    .isObject()
    .withMessage("Metadata must be an object"),
  validate,
];

export const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  validate,
];

export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === "string") {
      return obj.replace(/[<>]/g, "");
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};
