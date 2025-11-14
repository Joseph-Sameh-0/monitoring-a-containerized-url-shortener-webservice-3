# Microservices Architecture

## Overview

The URL Shortener application has been refactored into a microservices architecture where each service runs as a separate, independent component.

## Services

### 1. **Auth Service** (Port 9001)
- User registration and authentication
- JWT token generation and validation
- User management
- Database: `auth.db`

### 2. **URL Service** (Port 9002)
- URL shortening
- URL redirection
- Click tracking
- Database: `urls.db`

### 3. **File Service** (Port 9003)
- File upload and storage
- File download and sharing
- Supported formats: Images (PNG, JPEG, GIF) and PDF
- Database: `files.db`

### 4. **Note Service** (Port 9004)
- Note creation and storage
- Note viewing and sharing
- Database: `notes.db`

### 5. **Frontend Service** (Port 9000)
- React-based user interface
- Serves static assets
- Acts as entry point for users

## Running the Microservices

### Using Docker Compose (Recommended)

1. Build all services:
   ```bash
   ./build.sh
   ```

2. Start all microservices:
   ```bash
   docker compose up
   ```

3. Stop all services:
   ```bash
   docker compose down
   ```

### Running Individual Services Locally

Each service can be run independently for development:

```bash
# Auth Service
cd microservices/auth-service
../../backend/gradlew bootRun

# URL Service
cd microservices/url-service
../../backend/gradlew bootRun

# File Service
cd microservices/file-service
../../backend/gradlew bootRun

# Note Service
cd microservices/note-service
../../backend/gradlew bootRun

# Frontend (Development Mode)
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5173 in development mode.

### Frontend Configuration

The frontend has been updated to work with the microservices architecture. It communicates directly with each service using configurable endpoints.

**Environment Variables:**

Create a `.env` file in the `frontend` directory:

```env
VITE_AUTH_SERVICE_URL=http://localhost:9001
VITE_URL_SERVICE_URL=http://localhost:9002
VITE_FILE_SERVICE_URL=http://localhost:9003
VITE_NOTE_SERVICE_URL=http://localhost:9004
```

See [frontend/MICROSERVICES_SETUP.md](frontend/MICROSERVICES_SETUP.md) for detailed frontend configuration.

## Service Communication

- All services are isolated and run independently
- Each service has its own database for data isolation
- Services use JWT tokens for authentication
- All services share the same JWT secret for token validation

## Monitoring

### Prometheus
- Scrapes metrics from all services
- Available at: http://localhost:9090
- Each service exposes metrics at `/actuator/prometheus`

### Grafana
- Visualizes metrics from all services
- Available at: http://localhost:3000
- Pre-configured dashboards for service monitoring

## Architecture Benefits

1. **Scalability**: Each service can be scaled independently
2. **Isolation**: Failures in one service don't affect others
3. **Technology Flexibility**: Each service can use different technologies if needed
4. **Independent Deployment**: Services can be deployed separately
5. **Team Autonomy**: Different teams can work on different services

## Data Persistence

Each service maintains its own data directory:
- `./data/auth/` - Auth service data
- `./data/urls/` - URL service data
- `./data/files/` - File service data and uploads
- `./data/notes/` - Note service data

## Environment Variables

Common environment variables for all services:
- `JWT_SECRET`: Shared secret for JWT token validation
- `BASE_URL`: Base URL for each service
- `GRAFANA_USER`: Grafana admin username
- `GRAFANA_PASSWORD`: Grafana admin password

## Original Monolithic Setup

To run the original monolithic version:
```bash
./build.sh
docker compose up
```

## Troubleshooting

### Service won't start
- Check if the port is already in use
- Verify all environment variables are set
- Check Docker logs: `docker logs <service-name>`

### Database connection issues
- Ensure data directories exist and have proper permissions
- Check SQLite database files are not corrupted

### Authentication issues
- Verify JWT_SECRET is the same across all services
- Check token expiration settings
