# Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- PostgreSQL 15+ (optional, for production)
- Redis 7+ (optional, for caching)

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

**Required variables:**

- `JWT_SECRET` - Secret key for JWT tokens (use strong random string)
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens (use strong random string)
- `POSTGRES_PASSWORD` - PostgreSQL database password

**Optional variables:**

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `CORS_ORIGIN` - Allowed CORS origins (default: \*)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 3. Run Tests

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

## Docker Deployment

### 1. Build Docker Image

```bash
npm run docker:build
# or
docker build -t collaborative-workspace .
```

### 2. Run with Docker Compose

```bash
# Start all services (app, Redis, PostgreSQL)
npm run docker:up
# or
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
npm run docker:down
# or
docker-compose down
```

### 3. Run Single Container

```bash
docker run -d \
  -p 3000:3000 \
  -e JWT_SECRET=your-secret \
  -e JWT_REFRESH_SECRET=your-refresh-secret \
  -e NODE_ENV=production \
  --name collaborative-workspace \
  collaborative-workspace
```

## Production Deployment

### Option 1: Docker Compose (Recommended)

1. **Clone repository on server:**

```bash
git clone <your-repo-url>
cd collaborative-workspace-backend
```

2. **Configure environment:**

```bash
cp .env.example .env
nano .env  # Edit with production values
```

3. **Start services:**

```bash
docker-compose up -d
```

4. **Verify deployment:**

```bash
curl http://localhost:3000/health
```

### Option 2: Kubernetes

Create Kubernetes manifests (example):

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: collaborative-workspace
spec:
  replicas: 3
  selector:
    matchLabels:
      app: collaborative-workspace
  template:
    metadata:
      labels:
        app: collaborative-workspace
    spec:
      containers:
        - name: app
          image: your-registry/collaborative-workspace:latest
          ports:
            - containerPort: 3000
          env:
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: jwt-secret
            - name: REDIS_HOST
              value: redis-service
            - name: POSTGRES_HOST
              value: postgres-service
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: collaborative-workspace
spec:
  selector:
    app: collaborative-workspace
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
```

Deploy:

```bash
kubectl apply -f deployment.yaml
```

### Option 3: Cloud Platforms

#### AWS ECS/Fargate

1. Build and push image to ECR
2. Create ECS task definition
3. Create ECS service with load balancer
4. Configure environment variables in task definition

#### Google Cloud Run

```bash
gcloud run deploy collaborative-workspace \
  --image gcr.io/PROJECT_ID/collaborative-workspace \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Heroku

```bash
heroku create collaborative-workspace
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
git push heroku main
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. **Lint** - Runs code linting
2. **Test** - Runs unit and integration tests with coverage
3. **Build** - Compiles TypeScript
4. **Docker** - Builds and pushes Docker image (on main branch)

### Setup GitHub Secrets

Add these secrets to your GitHub repository:

- `DOCKERHUB_USERNAME` - Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub access token

## Monitoring & Observability

### Health Check

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production"
}
```

### Metrics (Prometheus)

Metrics are exposed at `/metrics` endpoint:

```bash
curl http://localhost:3000/metrics
```

**Available metrics:**

- `http_request_duration_seconds` - HTTP request latency
- `http_requests_total` - Total HTTP requests
- `active_websocket_connections` - Active WebSocket connections
- `jobs_processed_total` - Total jobs processed
- `cache_hits_total` - Cache hits
- `cache_misses_total` - Cache misses

### Logs

Logs are written to:

- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs
- Console (in development)

View logs:

```bash
# Docker
docker-compose logs -f app

# Kubernetes
kubectl logs -f deployment/collaborative-workspace

# Local files
tail -f logs/combined.log
```

## Scaling Considerations

### Horizontal Scaling

The application is stateless and can be scaled horizontally:

```bash
# Docker Compose
docker-compose up -d --scale app=3

# Kubernetes
kubectl scale deployment collaborative-workspace --replicas=5
```

### Load Balancing

Use a load balancer (Nginx, HAProxy, AWS ALB) to distribute traffic:

```nginx
upstream backend {
    least_conn;
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### WebSocket Scaling

For WebSocket scaling, use Redis adapter:

- Implement Redis pub/sub for cross-instance communication
- Use sticky sessions on load balancer

### Database Scaling

- Use connection pooling (already configured in Sequelize)
- Implement read replicas for read-heavy operations
- Use Redis for caching frequently accessed data

## Security Checklist

- ✅ Use strong JWT secrets (minimum 32 characters)
- ✅ Enable HTTPS in production (use reverse proxy)
- ✅ Set appropriate CORS origins (not \*)
- ✅ Keep dependencies updated (`npm audit`)
- ✅ Use environment variables for secrets
- ✅ Enable rate limiting (already configured)
- ✅ Implement input validation (already configured)
- ✅ Use Helmet for security headers (already configured)
- ✅ Run as non-root user in Docker (already configured)
- ✅ Regularly backup database

## Troubleshooting

### Application won't start

1. Check environment variables are set
2. Verify database connectivity
3. Check logs for errors
4. Ensure ports are not in use

### High memory usage

1. Check for memory leaks in logs
2. Reduce connection pool size
3. Implement pagination for large datasets
4. Scale horizontally instead of vertically

### WebSocket connections failing

1. Verify WebSocket support on load balancer
2. Check CORS configuration
3. Enable sticky sessions
4. Check firewall rules

### Database connection errors

1. Verify credentials in .env
2. Check network connectivity
3. Ensure database is running
4. Check connection pool settings

## Backup & Recovery

### Database Backup

```bash
# PostgreSQL
docker-compose exec postgres pg_dump -U postgres collaborative_workspace > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres collaborative_workspace < backup.sql
```

### Redis Backup

Redis persistence is enabled with AOF (Append Only File):

```bash
docker-compose exec redis redis-cli BGSAVE
```

## Performance Optimization

1. **Enable Redis caching** - Reduces database load
2. **Use connection pooling** - Reuses database connections
3. **Implement CDN** - For static assets
4. **Enable compression** - Gzip/Brotli for responses
5. **Database indexing** - Add indexes on frequently queried fields
6. **Horizontal scaling** - Add more instances as needed

## Support

For issues and questions:

- GitHub Issues: [your-repo-url]/issues
- Documentation: http://localhost:3000/api-docs
- Email: support@example.com
