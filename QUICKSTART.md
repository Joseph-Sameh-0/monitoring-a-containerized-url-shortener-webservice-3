# Quick Start Guide - Microservices Architecture

This guide will help you get started with the microservices architecture.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for frontend development)
- Java 21 (optional, for local microservice development)

## Option 1: Full Stack with Docker (Recommended)

Run everything with Docker Compose:

```bash
# 1. Build all services
./build.sh

# 2. Start all services
docker compose up

# 3. Access the application
# Frontend: http://localhost:9000
# Auth Service: http://localhost:9001
# URL Service: http://localhost:9002
# File Service: http://localhost:9003
# Note Service: http://localhost:9004
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000
```

That's it! All services are running and the frontend is accessible at http://localhost:9000.

## Option 2: Development Mode (Frontend with Live Reload)

For frontend development with hot module replacement:

```bash
# 1. Start microservices in background
docker compose up -d auth-service url-service file-service note-service

# 2. Install frontend dependencies (first time only)
cd frontend
npm install

# 3. Start frontend dev server
npm run dev

# 4. Open your browser
# Frontend: http://localhost:5173
```

The frontend will auto-reload when you make changes to the code.

## Option 3: Local Development (All Services)

Run each microservice individually for debugging:

```bash
# Terminal 1 - Auth Service
cd microservices/auth-service
../../backend/gradlew bootRun

# Terminal 2 - URL Service
cd microservices/url-service
../../backend/gradlew bootRun

# Terminal 3 - File Service
cd microservices/file-service
../../backend/gradlew bootRun

# Terminal 4 - Note Service
cd microservices/note-service
../../backend/gradlew bootRun

# Terminal 5 - Frontend
cd frontend
npm run dev
```

## Testing the Application

### 1. Register a User

1. Open http://localhost:5173 (or http://localhost:9000 if using Docker)
2. Click "Sign Up"
3. Enter username, email, and password
4. Click "Sign Up"

### 2. Shorten a URL

1. After logging in, enter a long URL
2. Click "Shorten URL"
3. Copy the shortened URL
4. Share it!

### 3. Upload a File

1. Click on the "Upload File" section
2. Select an image or PDF
3. Click "Upload File"
4. Get a shareable link

### 4. Save a Note

1. Click on the "Save Text/Note" section
2. Enter a title and content
3. Click "Save Note"
4. Get a shareable link

## Stopping Services

### Docker Compose
```bash
docker compose down
```

### Local Development
Press `Ctrl+C` in each terminal running a service.

## Environment Configuration

The frontend uses environment variables to connect to microservices. Default configuration:

```env
VITE_AUTH_SERVICE_URL=http://localhost:9001
VITE_URL_SERVICE_URL=http://localhost:9002
VITE_FILE_SERVICE_URL=http://localhost:9003
VITE_NOTE_SERVICE_URL=http://localhost:9004
```

These are set in `frontend/.env` and can be modified for different environments.

## Troubleshooting

### Services won't start
- Check if ports are already in use: `lsof -i :9001` (macOS/Linux) or `netstat -ano | findstr :9001` (Windows)
- Try stopping other applications using these ports

### Frontend can't connect to services
- Verify all microservices are running: `docker ps` or check each service terminal
- Check environment variables in `frontend/.env`
- Verify CORS is enabled in each microservice

### Database errors
- Clear data directories: `rm -rf data/`
- Restart services

### Build errors
- Clear Gradle cache: `./gradlew clean`
- Clear npm cache: `cd frontend && npm cache clean --force`

## Next Steps

- Read [MICROSERVICES.md](MICROSERVICES.md) for detailed architecture overview
- Check [frontend/MICROSERVICES_SETUP.md](frontend/MICROSERVICES_SETUP.md) for frontend configuration
- View [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details

## Support

For issues or questions:
1. Check existing documentation
2. Review Docker logs: `docker logs <container-name>`
3. Open an issue on GitHub

Happy coding! 🚀
