# Collaborative Workspace Backend

A production-grade real-time collaborative workspace backend built with **Clean Architecture** principles, following SOLID design patterns and framework independence.

## 🏗️ Architecture

This project follows **Clean Architecture** with clear separation of concerns:

```
src/
├── core/                    # Core Business Layer (Framework Independent)
│   ├── entities/           # Business entities
│   ├── interfaces/         # Repository & Service contracts
│   └── errors/             # Custom error classes
│
├── use-cases/              # Application Business Logic
│   ├── auth/              # Authentication use cases
│   ├── projects/          # Project management
│   ├── workspaces/        # Workspace management
│   ├── members/           # Member management
│   ├── jobs/              # Job processing
│   └── colloboration/     # Real-time collaboration
│
├── adapters/               # Interface Adapters
│   ├── controllers/       # HTTP request handlers
│   ├── repositories/      # Data access implementations
│   └── services/          # External service implementations
│
└── infrastructure/         # Frameworks & Drivers
    ├── http/              # Express server, routes, middleware
    └── di/                # Dependency injection container
```

## ✨ Features

- ✅ **Authentication & Authorization** - JWT-based auth with refresh tokens
- ✅ **Project Management** - Create, read, update, delete projects
- ✅ **Workspace Management** - Multiple workspaces per project
- ✅ **Team Collaboration** - Invite members with role-based access
- ✅ **Job Queue** - Async job processing
- ✅ **Real-time Events** - WebSocket-based collaboration
- ✅ **Caching** - Redis-based caching layer
- ✅ **Clean Architecture** - Framework-independent business logic
- ✅ **SOLID Principles** - Maintainable and testable code

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Redis (optional, for caching)
- PostgreSQL (optional, for production)

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd collaborative-workspace-backend
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env
```

4. Update `.env` with your configuration

5. Build the project

```bash
npm run build
```

6. Start the server

```bash
npm start
```

For development with auto-rebuild:

```bash
npm run dev
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/validate` - Validate token

### Projects (Protected)

- `POST /api/projects` - Create project
- `GET /api/projects` - List user's projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Workspaces (Protected)

- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces/project/:projectId` - List project workspaces

### Members (Protected)

- `POST /api/members/invite` - Invite member to project
- `GET /api/members/project/:projectId` - List project members

### Jobs (Protected)

- `POST /api/jobs` - Submit job
- `GET /api/jobs/:id` - Get job status

### Collaboration (Protected)

- `POST /api/collaboration/broadcast` - Broadcast event
- `GET /api/collaboration/history/:projectId` - Get activity history

### Health

- `GET /health` - Health check endpoint

## 🧪 Example Usage

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "OWNER"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Create Project (with auth token)

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "My Awesome Project",
    "description": "A collaborative workspace"
  }'
```

## 🏛️ Design Patterns Used

- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - Loose coupling
- **Strategy Pattern** - Interchangeable algorithms
- **Adapter Pattern** - Interface compatibility
- **Factory Pattern** - Object creation
- **Observer Pattern** - Event handling

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Token refresh mechanism
- Input validation
- Error handling without exposing internals

## 🧩 Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Caching**: Redis (ioredis)
- **Database**: In-memory (can be replaced with PostgreSQL/MongoDB)
- **Password Hashing**: bcrypt
- **Architecture**: Clean Architecture + SOLID

## 📦 Project Structure Benefits

1. **Framework Independence** - Business logic doesn't depend on Express
2. **Testability** - Easy to unit test use cases in isolation
3. **Maintainability** - Clear separation of concerns
4. **Scalability** - Easy to add new features
5. **Flexibility** - Easy to swap implementations (e.g., Express → Fastify)

## 🔄 Future Enhancements

- [ ] Real WebSocket implementation
- [ ] PostgreSQL/MongoDB integration
- [ ] BullMQ for job processing
- [ ] Rate limiting
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit & integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Monitoring & logging (Winston/Pino)

## 📝 License

ISC

## 👨‍💻 Author

Your Name

---

**Built with Clean Architecture principles for maximum maintainability and scalability** 🚀
