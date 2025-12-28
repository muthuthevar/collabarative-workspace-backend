/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [OWNER, COLLABORATOR, VIEWER]
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */

/**
 * @swagger
 * /api/auth/validate:
 *   get:
 *     tags: [Authentication]
 *     summary: Validate access token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create a new project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *   get:
 *     tags: [Projects]
 *     summary: List all user projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 *   put:
 *     tags: [Projects]
 *     summary: Update project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 *   delete:
 *     tags: [Projects]
 *     summary: Delete project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/workspaces:
 *   post:
 *     tags: [Workspaces]
 *     summary: Create a new workspace
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - name
 *             properties:
 *               projectId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [DOCUMENT, SPREADSHEET, PRESENTATION, CODE]
 *     responses:
 *       201:
 *         description: Workspace created successfully
 */

/**
 * @swagger
 * /api/workspaces/project/{projectId}:
 *   get:
 *     tags: [Workspaces]
 *     summary: List workspaces for a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of workspaces
 */

/**
 * @swagger
 * /api/members/invite:
 *   post:
 *     tags: [Members]
 *     summary: Invite a member to project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - email
 *               - role
 *             properties:
 *               projectId:
 *                 type: string
 *                 format: uuid
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [OWNER, COLLABORATOR, VIEWER]
 *     responses:
 *       201:
 *         description: Member invited successfully
 */

/**
 * @swagger
 * /api/members/project/{projectId}:
 *   get:
 *     tags: [Members]
 *     summary: List project members
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of members
 */

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     tags: [Jobs]
 *     summary: Submit a new job
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - payload
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [EXPORT, IMPORT, ANALYSIS, REPORT]
 *               payload:
 *                 type: object
 *     responses:
 *       201:
 *         description: Job submitted successfully
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get job status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Job status
 */

/**
 * @swagger
 * /api/collaboration/broadcast:
 *   post:
 *     tags: [Collaboration]
 *     summary: Broadcast a collaboration event
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - type
 *             properties:
 *               projectId:
 *                 type: string
 *                 format: uuid
 *               type:
 *                 type: string
 *                 enum: [USER_JOINED, USER_LEFT, FILE_CHANGED, CURSOR_MOVED]
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Event broadcasted successfully
 */

/**
 * @swagger
 * /api/collaboration/history/{projectId}:
 *   get:
 *     tags: [Collaboration]
 *     summary: Get activity history for a project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Activity history
 */

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Service is healthy
 */

/**
 * @swagger
 * /metrics:
 *   get:
 *     tags: [Health]
 *     summary: Prometheus metrics endpoint
 *     responses:
 *       200:
 *         description: Prometheus metrics
 */

export {};
