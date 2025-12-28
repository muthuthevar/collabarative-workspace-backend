# Collaborative Workspace Backend

A real-time collaborative workspace backend built with Clean Architecture, TypeScript, and Node.js.

## Architecture

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

## Features

### Core Functionality

- ✅ **Authentication & Authorization** - JWT-based auth with refresh tokens
- ✅ **Project Management** - Create, read, update, delete projects
- ✅ **Workspace Management** - Multiple workspaces per project
- ✅ **Team Collaboration** - Invite members with role-based access
- ✅ **Job Queue** - Async job processing
- ✅ **Real-time Events** - Socket.IO WebSocket collaboration
- ✅ **Caching** - Redis-based caching layer

### Architecture & Code Quality

- ✅ **Clean Architecture** - Framework-independent business logic
- ✅ **SOLID Principles** - Maintainable and testable code
- ✅ **Dependency Injection** - Loose coupling and testability
- ✅ **Repository Pattern** - Data access abstraction

### Security

- ✅ **Input Validation** - Express-validator with sanitization
- ✅ **Rate Limiting** - Configurable rate limits per endpoint
- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Configurable cross-origin resource sharing
- ✅ **Password Hashing** - Bcrypt with configurable rounds
- ✅ **JWT Tokens** - Secure token-based authentication

### Testing

- ✅ **Unit Tests** - Jest with 70%+ coverage target
- ✅ **Integration Tests** - API endpoint testing with Supertest
- ✅ **Test Coverage** - Comprehensive coverage reporting

### Monitoring & Observability

- ✅ **Winston Logger** - Structured logging with file rotation
- ✅ **Prometheus Metrics** - Request duration, counts, cache hits/misses
- ✅ **Health Checks** - Readiness and liveness endpoints

### Documentation

- ✅ **Swagger/OpenAPI** - Interactive API documentation
- ✅ **Deployment Guide** - Comprehensive deployment instructions
- ✅ **Architecture Diagrams** - Clear system design documentation

### DevOps

- ✅ **Docker** - Multi-stage production-ready Dockerfile
- ✅ **Docker Compose** - Full stack with Redis and PostgreSQL
- ✅ **CI/CD Pipeline** - GitHub Actions with lint, test, build, deploy
- ✅ **Graceful Shutdown** - Proper cleanup on SIGTERM/SIGINT

## Getting Started

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

6. Access the application

- **API:** http://localhost:3000
- **API Docs:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/health
- **Metrics:** http://localhost:3000/metrics

## API Endpoints

**Interactive API Documentation:** `http://localhost:3000/api-docs`

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

### Monitoring

- `GET /health` - Health check endpoint
- `GET /metrics` - Prometheus metrics endpoint
- `GET /api-docs` - Swagger API documentation

## Example Usage

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

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Caching**: Redis (ioredis)
- **Database**: In-memory (can be replaced with PostgreSQL/MongoDB)
- **Password Hashing**: bcrypt
- **Architecture**: Clean Architecture + SOLID

## Project Structure Benefits

1. **Framework Independence** - Business logic doesn't depend on Express
2. **Testability** - Easy to unit test use cases in isolation
3. **Maintainability** - Clear separation of concerns
4. **Scalability** - Easy to add new features
5. **Flexibility** - Easy to swap implementations (e.g., Express → Fastify)

## Testing

### Run Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Coverage Target

The project maintains **70%+ test coverage** across:

- Branches
- Functions
- Lines
- Statements

### Test Structure

```
src/__tests__/
├── unit/
│   ├── entities/          # Entity tests
│   ├── use-cases/         # Business logic tests
│   └── services/          # Service tests
└── integration/
    ├── auth.test.ts       # Auth API tests
    └── projects.test.ts   # Project API tests
```

## Deployment

### Quick Start with Docker

```bash
# Build and start all services
npm run docker:up

# View logs
docker-compose logs -f

# Stop services
npm run docker:down
```

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:

- Docker deployment
- Kubernetes manifests
- Cloud platform deployment (AWS, GCP, Heroku)
- CI/CD pipeline setup
- Monitoring and observability
- Scaling strategies
- Security checklist

## Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

### Prometheus Metrics

```bash
curl http://localhost:3000/metrics
```

**Available Metrics:**

- HTTP request duration and counts
- Active WebSocket connections
- Jobs processed
- Cache hits/misses
- System metrics (CPU, memory)

### Logs

Logs are written to:

- `logs/error.log` - Error logs
- `logs/combined.log` - All logs
- Console (development mode)

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with configurable rounds
- **Rate Limiting** - Protection against brute force
- **Input Validation** - Comprehensive request validation
- **Input Sanitization** - XSS protection
- **Helmet.js** - Security headers
- **CORS** - Configurable cross-origin policies
- **Environment Variables** - Secure secret management
- **Non-root Docker User** - Container security

## Future Enhancements

- [ ] PostgreSQL/MongoDB repository implementations
- [ ] BullMQ for advanced job processing
- [ ] Email service with real SMTP
- [ ] File upload and storage
- [ ] Advanced caching strategies
- [ ] GraphQL API option
- [ ] Multi-tenancy support
- [ ] Audit logging

## Documentation

- **API Documentation:** http://localhost:3000/api-docs
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Architecture:** See "Architecture" section above
- **Environment Variables:** [.env.example](./.env.example)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Clean Architecture principles
- Write tests for new features (maintain 70%+ coverage)
- Use TypeScript strict mode
- Follow existing code style
- Update documentation

## License

ISC

## Author

Your Name

## Acknowledgments

- Clean Architecture by Robert C. Martin
- Domain-Driven Design principles
- SOLID design patterns
- Express.js community

---
