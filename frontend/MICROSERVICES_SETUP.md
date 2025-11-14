# Frontend Configuration for Microservices

## Overview

The frontend has been updated to work with the microservices architecture. It now communicates directly with each microservice instead of relying on a monolithic backend.

## Architecture

The frontend connects to 4 separate microservices:

1. **Auth Service** (Port 9001) - Handles authentication and user registration
2. **URL Service** (Port 9002) - Manages URL shortening and redirection
3. **File Service** (Port 9003) - Handles file uploads and downloads
4. **Note Service** (Port 9004) - Manages text notes

## Configuration

### Environment Variables

The frontend uses environment variables to configure microservice URLs. Create a `.env` file in the `frontend` directory:

```env
VITE_AUTH_SERVICE_URL=http://localhost:9001
VITE_URL_SERVICE_URL=http://localhost:9002
VITE_FILE_SERVICE_URL=http://localhost:9003
VITE_NOTE_SERVICE_URL=http://localhost:9004
```

For production, update these URLs to your deployed service endpoints.

### API Configuration

The API endpoints are centralized in `src/config/api.js`:

```javascript
import { API_ENDPOINTS } from '../config/api'

// Example: Login
fetch(API_ENDPOINTS.AUTH.LOGIN, { ... })

// Example: Shorten URL
fetch(API_ENDPOINTS.URL.SHORTEN, { ... })
```

## Running the Frontend

### Development Mode

1. **Start all microservices:**
   ```bash
   docker compose -f docker-compose-microservices.yml up
   ```

2. **Start the frontend development server:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173

### Production Build

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **The built files will be in `frontend/dist`**

You can serve these static files using any web server (nginx, Apache, etc.) or deploy to a CDN.

## CORS Configuration

The microservices are configured to accept cross-origin requests from the frontend. Each service has CORS enabled in its `WebConfig.kt`:

```kotlin
registry.addMapping("/**")
    .allowedOrigins("*")
    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
    .allowedHeaders("*")
```

## API Endpoints Reference

### Auth Service (Port 9001)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### URL Service (Port 9002)
- `POST /shorten` - Shorten a URL
- `GET /{shortCode}` - Redirect to original URL
- `GET /api/urls/my-urls` - Get user's URLs
- `GET /admin/urls` - Get all URLs (admin)

### File Service (Port 9003)
- `POST /api/files/upload` - Upload a file
- `GET /f/{shortCode}` - Download/view file
- `GET /api/files/my-files` - Get user's files

### Note Service (Port 9004)
- `POST /api/notes/save` - Save a note
- `GET /n/{shortCode}` - View a note
- `GET /api/notes/my-notes` - Get user's notes

## Deployment Considerations

### Environment-Specific Configuration

For different environments (development, staging, production), create separate `.env` files:

- `.env.development` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production environment

Vite will automatically load the appropriate file based on the mode.

### Service Discovery

In a production environment, consider using:
- **API Gateway** - Single entry point for all microservices
- **Service Mesh** - For advanced traffic management
- **Load Balancer** - Distribute traffic across service instances

### Security

1. **HTTPS** - Always use HTTPS in production
2. **Environment Variables** - Never commit `.env` files to version control
3. **API Keys** - Use proper authentication tokens
4. **CORS** - Configure allowed origins properly for production

## Troubleshooting

### CORS Errors

If you encounter CORS errors:
1. Verify microservices are running
2. Check CORS configuration in each service's `WebConfig.kt`
3. Ensure environment variables are set correctly

### Connection Refused

If frontend can't connect to services:
1. Verify all microservices are running: `docker ps`
2. Check service ports are accessible
3. Verify environment variables in `.env`

### Authentication Issues

If auth is not working:
1. Clear browser localStorage
2. Check JWT_SECRET is the same across all services
3. Verify token is being sent in Authorization header

## Migration from Monolith

The frontend now works with microservices without requiring the monolithic backend. Key changes:

1. ✅ API calls updated to use service-specific endpoints
2. ✅ Environment variables for service URLs
3. ✅ CORS configuration in place
4. ✅ No proxy configuration needed
5. ✅ Independent service communication

The frontend can now be deployed independently and communicate with distributed microservices.
