# Docker Support for Pilakon Svelte

This project includes comprehensive Docker support for both development and production environments with Server-Side Rendering (SSR) capabilities.

## Prerequisites

- Docker and Docker Compose installed on your system
- Node.js 20+ (for local development)

## Quick Start

### Production Build

1. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

2. **Build and run with Docker Compose:**
   ```bash
   pnpm run docker:prod
   ```

3. **Access your application:**
   - Open http://localhost:3000 in your browser

### Development with Docker

1. **Run development environment:**
   ```bash
   pnpm run docker:dev
   ```

2. **Access development server:**
   - Open http://localhost:5173 in your browser
   - Hot reloading is enabled

## Available Commands

### Package.json Scripts

- `pnpm run docker:build` - Build the Docker image
- `pnpm run docker:run` - Run the built image
- `pnpm run docker:dev` - Start development environment
- `pnpm run docker:prod` - Start production environment
- `pnpm run docker:down` - Stop all containers

### Manual Docker Commands

#### Build the image:
```bash
docker build -t pilakon-svelte .
```

#### Run the container:
```bash
docker run -p 3000:3000 pilakon-svelte
```

#### Development with volume mounting:
```bash
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules pilakon-svelte pnpm run dev
```

## Environment Variables

Create a `.env` file based on `env.example`:

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
```

## Docker Configuration Details

### Production Dockerfile

- **Multi-stage build** for optimized image size
- **Node.js 20 Alpine** base image for security and size
- **Non-root user** (sveltekit) for security
- **Health checks** included
- **SSR support** with @sveltejs/adapter-node

### Development Dockerfile

- **Volume mounting** for hot reloading
- **Development dependencies** included
- **Port 5173** exposed for Vite dev server

### Docker Compose

- **Production service** (`app`) with health checks
- **Development service** (`app-dev`) with volume mounting
- **Environment variable** management
- **Restart policies** configured

## Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Development   │    │   Production    │
│                 │    │                 │
│  Dockerfile.dev │    │   Dockerfile    │
│  Port: 5173     │    │  Port: 3000     │
│  Hot Reload     │    │  SSR Enabled    │
│  Volume Mount   │    │  Optimized      │
└─────────────────┘    └─────────────────┘
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "3001:3000"  # Use port 3001 instead
   ```

2. **Environment variables not loading:**
   ```bash
   # Ensure .env file exists and has correct values
   cp env.example .env
   ```

3. **Build failures:**
   ```bash
   # Clear Docker cache
   docker system prune -a
   ```

4. **Permission issues:**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Health Checks

The production container includes health checks:
- **Endpoint:** `http://localhost:3000/`
- **Interval:** 30 seconds
- **Timeout:** 10 seconds
- **Retries:** 3

Check container health:
```bash
docker ps  # Look for "healthy" status
```

## Performance Optimization

### Image Size Optimization

- Multi-stage builds reduce final image size
- Alpine Linux base image
- Only production dependencies in final stage
- Proper .dockerignore file

### Runtime Optimization

- Non-root user execution
- Proper signal handling
- Health checks for container orchestration
- Environment-based configuration

## Security Considerations

- **Non-root user** execution
- **Minimal base image** (Alpine Linux)
- **No unnecessary packages** in production
- **Environment variable** management
- **Health checks** for monitoring

## Deployment

### Production Deployment

1. **Build the image:**
   ```bash
   docker build -t pilakon-svelte:latest .
   ```

2. **Tag for registry:**
   ```bash
   docker tag pilakon-svelte:latest your-registry/pilakon-svelte:latest
   ```

3. **Push to registry:**
   ```bash
   docker push your-registry/pilakon-svelte:latest
   ```

4. **Deploy with orchestration:**
   ```bash
   # Kubernetes, Docker Swarm, or cloud services
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Environment-Specific Configurations

Create environment-specific compose files:
- `docker-compose.dev.yml` - Development overrides
- `docker-compose.prod.yml` - Production overrides
- `docker-compose.staging.yml` - Staging overrides

## Monitoring and Logs

### View logs:
```bash
docker-compose logs -f app
```

### Monitor resource usage:
```bash
docker stats pilakon-svelte
```

### Access container shell:
```bash
docker exec -it pilakon-svelte sh
```
