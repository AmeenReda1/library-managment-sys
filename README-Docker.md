# Docker Setup for Library System

This document explains how to run the Library System using Docker and Docker Compose.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Quick Start

### Production Setup

1. **Clone the repository and navigate to the project directory**

   ```bash
   cd library-system
   ```

2. **Start all services**

   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - API: http://localhost:3000
   - pgAdmin: http://localhost:8080
     - Email: admin@library.com
     - Password: admin123

### Development Setup

1. **Start development environment**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Access the application**
   - API: http://localhost:3001
   - Debug port: 9229

## Services Overview

### Production (`docker-compose.yml`)

- **app**: NestJS application (Port 3000)
- **postgres**: PostgreSQL database (Port 5432)
- **redis**: Redis cache (Port 6379)
- **pgadmin**: Database management UI (Port 8080)

### Development (`docker-compose.dev.yml`)

- **app**: NestJS with hot reload and debugging (Port 3001, Debug 9229)
- **postgres**: PostgreSQL development database (Port 5433)

## Environment Variables

The application uses these environment variables:

```env
# Database
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=library_system
DATABASE_USER=library_user
DATABASE_PASSWORD=library_password

# Application
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Pagination
PAGINATION_DEFAULT_LIMIT=10
PAGINATION_MAX_LIMIT=100
```

## Common Commands

### Production

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f app

# Restart application
docker-compose restart app

# Rebuild and restart
docker-compose up -d --build app

# Clean up (removes volumes too)
docker-compose down -v
```

### Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View application logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop development environment
docker-compose -f docker-compose.dev.yml down

# Access application container shell
docker-compose -f docker-compose.dev.yml exec app sh
```

### Database Operations

```bash
# Access PostgreSQL directly
docker exec -it library-system-db psql -U library_user -d library_system

# Backup database
docker exec library-system-db pg_dump -U library_user library_system > backup.sql

# Restore database
docker exec -i library-system-db psql -U library_user library_system < backup.sql
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change ports in docker-compose.yml
   - Or stop conflicting services

2. **Database connection issues**
   - Wait for database to be ready (health checks are configured)
   - Check logs: `docker-compose logs postgres`

3. **Application not starting**
   - Check logs: `docker-compose logs app`
   - Verify environment variables
   - Ensure database is healthy

### Debugging

1. **Enable debug mode in development**

   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   # Connect debugger to localhost:9229
   ```

2. **Access container shell**

   ```bash
   docker-compose exec app sh
   ```

3. **Check container health**
   ```bash
   docker-compose ps
   ```

## Security Notes

🚨 **Important for Production:**

1. **Change default passwords** in docker-compose.yml
2. **Use environment file** instead of hardcoded values
3. **Use secrets management** for sensitive data
4. **Enable SSL/TLS** for external connections
5. **Use specific image tags** instead of `latest`
6. **Limit resource usage** with Docker constraints

## Performance Optimization

1. **Use multi-stage builds** (already implemented)
2. **Optimize layer caching** in Dockerfile
3. **Use .dockerignore** to reduce build context
4. **Configure resource limits** in production
5. **Use health checks** for better reliability

## Monitoring

Access container metrics:

```bash
# View resource usage
docker stats

# View service status
docker-compose ps

# Check service health
docker-compose exec app wget --spider http://localhost:3000
```
