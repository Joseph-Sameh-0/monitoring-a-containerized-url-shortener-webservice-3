# URL Shortener - Architecture & System Overview

> **Complete Architecture Documentation for Presentation**  
> Digital Egypt Pioneers Initiative - DevOps Track

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Microservices Design](#microservices-design)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Data Flow & Communication](#data-flow--communication)
7. [Monitoring Stack](#monitoring-stack)
8. [Docker Infrastructure](#docker-infrastructure)
9. [Network Architecture](#network-architecture)
10. [Data Persistence](#data-persistence)
11. [Technology Stack Summary](#technology-stack-summary)

---

## Project Overview

### What is This Project?

A **URL Shortener** web application that transforms long URLs into short, shareable links. The system is built using a **microservices architecture** with comprehensive monitoring capabilities.

### Key Features

| Feature | Description |
|---------|-------------|
| **URL Shortening** | Convert long URLs to short, shareable links |
| **File Sharing** | Upload and share images and PDF files |
| **Note Sharing** | Create and share text notes |
| **User Authentication** | Secure registration and login |
| **Click Tracking** | Monitor link usage statistics |
| **Real-time Monitoring** | Prometheus metrics + Grafana dashboards |

### Team Members

- **Beshoy Ibrahim Asham Melek**
- **Hassan Saleh Hassan Gad**
- **Joseph Sameh Fouad Nasr**

---

## System Architecture

### High-Level Overview

```mermaid
graph TB
    subgraph "Client Layer"
        User[("👤 User Browser")]
    end
    
    subgraph "Docker Host"
        subgraph "Application Services"
            FE[Frontend<br/>React + Nginx<br/>Port 9000]
            
            subgraph "Backend Microservices"
                AUTH[Auth Service<br/>Port 9001]
                URL[URL Service<br/>Port 9002]
                FILE[File Service<br/>Port 9003]
                NOTE[Note Service<br/>Port 9004]
            end
        end
        
        subgraph "Monitoring Stack"
            PROM[Prometheus<br/>Port 9090]
            GRAF[Grafana<br/>Port 3000]
        end
        
        subgraph "Data Storage"
            DB1[(auth.db)]
            DB2[(urls.db)]
            DB3[(files.db)]
            DB4[(notes.db)]
            TSDB[(Prometheus TSDB)]
        end
    end
    
    User -->|HTTP| FE
    FE -->|REST API| AUTH
    FE -->|REST API| URL
    FE -->|REST API| FILE
    FE -->|REST API| NOTE
    
    AUTH --> DB1
    URL --> DB2
    FILE --> DB3
    NOTE --> DB4
    
    PROM -->|Scrape Metrics| AUTH
    PROM -->|Scrape Metrics| URL
    PROM -->|Scrape Metrics| FILE
    PROM -->|Scrape Metrics| NOTE
    PROM --> TSDB
    
    GRAF -->|Query| PROM
    User -->|View Dashboards| GRAF
```

### Architecture Principles

1. **Microservices Pattern**: Each service is independent and focused on a single domain
2. **Containerization**: All services run in Docker containers
3. **Service Isolation**: Each service has its own database
4. **Shared Authentication**: JWT tokens validated across all services
5. **Centralized Monitoring**: Single Prometheus instance scrapes all services

---

## Microservices Design

### Service Overview

```mermaid
graph LR
    subgraph "Microservices"
        A[Auth Service]
        B[URL Service]
        C[File Service]
        D[Note Service]
    end
    
    subgraph "Capabilities"
        A1[User Registration]
        A2[User Login]
        A3[JWT Generation]
        
        B1[URL Shortening]
        B2[URL Redirection]
        B3[Click Tracking]
        
        C1[File Upload]
        C2[File Download]
        C3[File Sharing]
        
        D1[Note Creation]
        D2[Note Viewing]
        D3[Note Sharing]
    end
    
    A --> A1
    A --> A2
    A --> A3
    
    B --> B1
    B --> B2
    B --> B3
    
    C --> C1
    C --> C2
    C --> C3
    
    D --> D1
    D --> D2
    D --> D3
```

### Service Details

| Service | Port | Technology | Database | Primary Responsibility |
|---------|------|------------|----------|------------------------|
| **Auth Service** | 9001 | Spring Boot + Kotlin | auth.db (SQLite) | User authentication & JWT management |
| **URL Service** | 9002 | Spring Boot + Kotlin | urls.db (SQLite) | URL shortening & redirection |
| **File Service** | 9003 | Spring Boot + Kotlin | files.db (SQLite) | File upload & sharing |
| **Note Service** | 9004 | Spring Boot + Kotlin | notes.db (SQLite) | Note creation & sharing |
| **Frontend** | 9000 | React + Nginx | - | User interface |

### API Endpoints Summary

#### Auth Service (Port 9001)
```
POST /api/auth/register  → Register new user
POST /api/auth/login     → Login and get JWT token
GET  /actuator/prometheus → Metrics endpoint
```

#### URL Service (Port 9002)
```
POST /shorten           → Create short URL
GET  /{shortCode}       → Redirect to original URL
GET  /api/urls/my-urls  → Get user's URLs
GET  /actuator/prometheus → Metrics endpoint
```

#### File Service (Port 9003)
```
POST /api/files/upload    → Upload file
GET  /f/{shortCode}       → Download/view file
GET  /api/files/my-files  → Get user's files
GET  /actuator/prometheus → Metrics endpoint
```

#### Note Service (Port 9004)
```
POST /api/notes/save     → Save note
GET  /n/{shortCode}      → View note
GET  /api/notes/my-notes → Get user's notes
GET  /actuator/prometheus → Metrics endpoint
```

---

## Frontend Architecture

### Technology Stack

```mermaid
graph TB
    subgraph "Frontend Stack"
        React[React 19]
        Vite[Vite Build Tool]
        CSS[Modern CSS]
    end
    
    subgraph "Components"
        Header[Header Component]
        UrlShortener[URL Shortener]
        FileUpload[File Upload]
        TextSaver[Text Saver]
        Auth[Auth Components]
        History[History Views]
    end
    
    subgraph "State Management"
        Context[React Context]
        LocalStorage[Local Storage]
    end
    
    React --> Components
    Components --> UrlShortener
    Components --> FileUpload
    Components --> TextSaver
    Components --> Auth
    Components --> History
    
    Context --> Auth
    LocalStorage --> Context
```

### Component Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   ├── components/
│   │   ├── Header.jsx       # Navigation & theme toggle
│   │   ├── UrlShortener.jsx # URL shortening form
│   │   ├── FileUpload.jsx   # File upload component
│   │   ├── TextSaver.jsx    # Note saving component
│   │   ├── Login.jsx        # Login modal
│   │   ├── Register.jsx     # Registration modal
│   │   ├── UrlHistory.jsx   # Recent URLs list
│   │   └── UserHistory.jsx  # User's saved items
│   ├── config/
│   │   └── api.js           # API endpoint configuration
│   └── context/
│       └── AuthContext.jsx  # Authentication state
├── Dockerfile               # Multi-stage Docker build
└── package.json             # Dependencies
```

### Frontend-to-Backend Communication

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant AuthService
    participant URLService
    participant FileService
    participant NoteService
    
    User->>Frontend: Open application
    Frontend->>User: Display UI
    
    User->>Frontend: Click "Register"
    Frontend->>AuthService: POST /api/auth/register
    AuthService->>Frontend: Return success
    
    User->>Frontend: Click "Login"
    Frontend->>AuthService: POST /api/auth/login
    AuthService->>Frontend: Return JWT token
    Frontend->>Frontend: Store token in localStorage
    
    User->>Frontend: Shorten URL
    Frontend->>URLService: POST /shorten (with JWT)
    URLService->>Frontend: Return short URL
    
    User->>Frontend: Upload file
    Frontend->>FileService: POST /api/files/upload (with JWT)
    FileService->>Frontend: Return file link
    
    User->>Frontend: Save note
    Frontend->>NoteService: POST /api/notes/save (with JWT)
    NoteService->>Frontend: Return note link
```

---

## Backend Architecture

### Spring Boot Service Structure

Each microservice follows the same architectural pattern:

```mermaid
graph TB
    subgraph "Spring Boot Service"
        Controller[REST Controllers]
        Service[Business Logic Services]
        Repository[JPA Repositories]
        Security[Security Filter]
        Actuator[Actuator Endpoints]
    end
    
    subgraph "External"
        Client[HTTP Client]
        DB[(SQLite Database)]
        Prometheus[Prometheus]
    end
    
    Client --> Security
    Security --> Controller
    Controller --> Service
    Service --> Repository
    Repository --> DB
    
    Prometheus --> Actuator
```

### Service Architecture Pattern

```
microservices/
├── auth-service/
│   ├── src/main/kotlin/
│   │   └── com/urlshortener/auth/
│   │       ├── AuthApplication.kt       # Main class
│   │       ├── controller/              # REST endpoints
│   │       ├── service/                 # Business logic
│   │       ├── repository/              # Data access
│   │       ├── model/                   # Domain entities
│   │       ├── security/                # JWT handling
│   │       └── config/                  # Configuration
│   ├── build.gradle.kts
│   └── Dockerfile
├── url-service/
├── file-service/
└── note-service/
```

### Security Flow (JWT Authentication)

```mermaid
sequenceDiagram
    participant Client
    participant AuthService
    participant OtherService
    
    Note over Client,AuthService: Login Flow
    Client->>AuthService: POST /api/auth/login<br/>{username, password}
    AuthService->>AuthService: Validate credentials
    AuthService->>AuthService: Generate JWT token
    AuthService->>Client: Return JWT token
    
    Note over Client,OtherService: Authenticated Request
    Client->>OtherService: POST /shorten<br/>Authorization: Bearer {JWT}
    OtherService->>OtherService: Validate JWT signature
    OtherService->>OtherService: Extract user from token
    OtherService->>OtherService: Process request
    OtherService->>Client: Return response
```

### Shared JWT Secret

All services share the same `JWT_SECRET` environment variable to validate tokens:

```
┌──────────────────────────────────────────────────────────────────────┐
│                           JWT_SECRET                                 │
│              (Shared across all microservices)                       │
├──────────────────────────────────────────────────────────────────────┤
│  Auth Service  │  URL Service  │  File Service  │    Note Service    │
│  (generates)   │  (validates)  │   (validates)  │    (validates)     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow & Communication

### User Journey - URL Shortening

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Frontend
    participant URLService
    participant Database
    
    User->>Browser: Enter long URL
    Browser->>Frontend: Submit form
    Frontend->>URLService: POST /shorten<br/>{"long_url": "https://..."}
    URLService->>URLService: Generate short code
    URLService->>Database: Save URL mapping
    Database->>URLService: Confirm save
    URLService->>Frontend: {"short_url": "http://localhost:9002/abc123"}
    Frontend->>Browser: Display short URL
    Browser->>User: Copy to clipboard
    
    Note over User,Database: Later - URL Redirection
    User->>Browser: Visit short URL
    Browser->>URLService: GET /abc123
    URLService->>Database: Lookup original URL
    URLService->>Database: Increment click count
    URLService->>Browser: 302 Redirect
    Browser->>User: Original website
```

### Service Communication Pattern

```mermaid
graph TB
    subgraph "Direct Communication"
        FE[Frontend] -->|REST API| MS[Microservices]
    end
    
    subgraph "No Inter-service Communication"
        AUTH[Auth Service]
        URL[URL Service]
        FILE[File Service]
        NOTE[Note Service]
    end
    
    subgraph "Shared Configuration"
        ENV[.env File]
        JWT[JWT_SECRET]
    end
    
    MS --> AUTH
    MS --> URL
    MS --> FILE
    MS --> NOTE
    
    ENV --> JWT
    JWT --> AUTH
    JWT --> URL
    JWT --> FILE
    JWT --> NOTE
```

**Key Design Decision**: Services do not communicate with each other directly. Each service validates JWT tokens independently using the shared secret.

---

## Monitoring Stack

### Prometheus Architecture

```mermaid
graph TB
    subgraph "Microservices"
        A[Auth Service<br/>/actuator/prometheus]
        U[URL Service<br/>/actuator/prometheus]
        F[File Service<br/>/actuator/prometheus]
        N[Note Service<br/>/actuator/prometheus]
    end
    
    subgraph "Prometheus"
        Scraper[Scraper<br/>Pull every 15s]
        TSDB[(Time Series DB)]
        PromQL[Query Engine]
    end
    
    subgraph "Grafana"
        DS[Data Source]
        Dashboard[Dashboards]
        Alerts[Alerting]
    end
    
    A -->|Expose metrics| Scraper
    U -->|Expose metrics| Scraper
    F -->|Expose metrics| Scraper
    N -->|Expose metrics| Scraper
    
    Scraper --> TSDB
    TSDB --> PromQL
    PromQL --> DS
    DS --> Dashboard
    DS --> Alerts
```

### Metrics Flow

```mermaid
sequenceDiagram
    participant Service
    participant Micrometer
    participant Actuator
    participant Prometheus
    participant Grafana
    participant User
    
    Note over Service,Micrometer: Application generates metrics
    Service->>Micrometer: Record metric
    Micrometer->>Actuator: Expose via /actuator/prometheus
    
    Note over Actuator,Prometheus: Prometheus scrapes every 15s
    loop Every 15 seconds
        Prometheus->>Actuator: GET /actuator/prometheus
        Actuator->>Prometheus: Metrics in Prometheus format
        Prometheus->>Prometheus: Store in TSDB
    end
    
    Note over Prometheus,User: User views dashboards
    User->>Grafana: Open dashboard
    Grafana->>Prometheus: PromQL query
    Prometheus->>Grafana: Query results
    Grafana->>User: Render visualization
```

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s      # How often to scrape
  evaluation_interval: 15s   # How often to evaluate rules

scrape_configs:
  - job_name: 'auth-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['auth-service:9001']
        labels:
          service: 'auth'

  - job_name: 'url-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['url-service:9002']
        labels:
          service: 'url'

  # ... file-service and note-service similar
```

### Grafana Dashboard Structure

```mermaid
graph TB
    subgraph "Dashboard Layout"
        R1[Row 1: Service Health]
        R2[Row 2: HTTP Metrics]
        R3[Row 3: JVM Metrics]
        R4[Row 4: System Metrics]
    end
    
    subgraph "Service Health Panels"
        UP[Service Up/Down Status]
        RESP[Response Time]
        ERR[Error Rate]
    end
    
    subgraph "HTTP Panels"
        REQ[Request Rate]
        LAT[Latency Distribution]
        STATUS[Status Codes]
    end
    
    subgraph "JVM Panels"
        MEM[Memory Usage]
        GC[Garbage Collection]
        THREADS[Thread Count]
    end
    
    R1 --> UP
    R1 --> RESP
    R1 --> ERR
    R2 --> REQ
    R2 --> LAT
    R2 --> STATUS
    R3 --> MEM
    R3 --> GC
    R3 --> THREADS
```

### Key Metrics Monitored

| Metric Category | Metric Name | Description |
|-----------------|-------------|-------------|
| **HTTP** | `http_server_requests_seconds_count` | Total request count |
| **HTTP** | `http_server_requests_seconds_sum` | Total request time |
| **HTTP** | `http_server_requests_seconds_bucket` | Response time histogram |
| **JVM** | `jvm_memory_used_bytes` | Current memory usage |
| **JVM** | `jvm_gc_pause_seconds` | Garbage collection pauses |
| **System** | `system_cpu_usage` | CPU utilization |
| **System** | `process_uptime_seconds` | Service uptime |

---

## Docker Infrastructure

### Container Architecture

```mermaid
graph TB
    subgraph "Docker Host"
        subgraph "Application Containers"
            C1[auth-service<br/>eclipse-temurin:21-jre]
            C2[url-service<br/>eclipse-temurin:21-jre]
            C3[file-service<br/>eclipse-temurin:21-jre]
            C4[note-service<br/>eclipse-temurin:21-jre]
            C5[frontend<br/>nginx:alpine]
        end
        
        subgraph "Monitoring Containers"
            C6[prometheus<br/>prom/prometheus]
            C7[grafana<br/>grafana/grafana]
        end
        
        subgraph "Networks"
            N1[microservices network]
            N2[monitoring network]
        end
        
        subgraph "Volumes"
            V1[./data/auth]
            V2[./data/urls]
            V3[./data/files]
            V4[./data/notes]
            V5[prometheus_data]
        end
    end
    
    C1 --> N1
    C2 --> N1
    C3 --> N1
    C4 --> N1
    C5 --> N1
    
    C1 --> N2
    C2 --> N2
    C3 --> N2
    C4 --> N2
    C5 --> N2
    C6 --> N2
    C7 --> N2
    
    C1 --> V1
    C2 --> V2
    C3 --> V3
    C4 --> V4
    C6 --> V5
```

### Docker Compose Services

```yaml
services:
  # Application Services
  auth-service:     # Port 9001 → 9001
  url-service:      # Port 9002 → 9002
  file-service:     # Port 9003 → 9003
  note-service:     # Port 9004 → 9004
  frontend:         # Port 9000 → 80

  # Monitoring Services
  prometheus:       # Port 9090 → 9090
  grafana:          # Port 3000 → 3000

networks:
  microservices:    # Service-to-service communication
  monitoring:       # Prometheus scraping

volumes:
  prometheus_data:  # Named volume for Prometheus TSDB
```

### Multi-Stage Build (Frontend)

```dockerfile
# Stage 1: Build React application
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Service Build

```dockerfile
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY microservices/auth-service/build/libs/auth-service-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir -p /app/data
EXPOSE 9001
CMD ["java", "-jar", "app.jar"]
```

---

## Network Architecture

### Network Topology

```mermaid
graph TB
    subgraph "External Access"
        Internet[Internet / User Browser]
    end
    
    subgraph "Docker Networks"
        subgraph "microservices network (bridge)"
            FE[Frontend :9000]
            AUTH[Auth :9001]
            URL[URL :9002]
            FILE[File :9003]
            NOTE[Note :9004]
        end
        
        subgraph "monitoring network (bridge)"
            AUTH2[Auth Service]
            URL2[URL Service]
            FILE2[File Service]
            NOTE2[Note Service]
            FE2[Frontend]
            PROM[Prometheus :9090]
            GRAF[Grafana :3000]
        end
    end
    
    Internet -->|Port 9000| FE
    Internet -->|Port 9090| PROM
    Internet -->|Port 3000| GRAF
    
    FE -.->|Internal DNS| AUTH
    FE -.->|Internal DNS| URL
    FE -.->|Internal DNS| FILE
    FE -.->|Internal DNS| NOTE
    
    PROM -.->|Scrape| AUTH2
    PROM -.->|Scrape| URL2
    PROM -.->|Scrape| FILE2
    PROM -.->|Scrape| NOTE2
```

### Port Mapping

| Service | Host Port | Container Port | Protocol |
|---------|-----------|----------------|----------|
| Frontend | 9000 | 80 | HTTP |
| Auth Service | 9001 | 9001 | HTTP |
| URL Service | 9002 | 9002 | HTTP |
| File Service | 9003 | 9003 | HTTP |
| Note Service | 9004 | 9004 | HTTP |
| Prometheus | 9090 | 9090 | HTTP |
| Grafana | 3000 | 3000 | HTTP |

### Service Discovery

Services communicate using Docker's internal DNS:
- `auth-service:9001` (not localhost)
- `url-service:9002`
- `file-service:9003`
- `note-service:9004`
- `prometheus:9090`

---

## Data Persistence

### Storage Strategy

```mermaid
graph TB
    subgraph "Bind Mounts (Host → Container)"
        HD[Host: ./data/]
        HD --> |./data/auth| CA[Container: /app/data]
        HD --> |./data/urls| CU[Container: /app/data]
        HD --> |./data/files| CF[Container: /app/data]
        HD --> |./data/notes| CN[Container: /app/data]
    end
    
    subgraph "Named Volume (Docker Managed)"
        PV[prometheus_data]
        PV --> CP[Container: /prometheus]
    end
    
    subgraph "SQLite Databases"
        CA --> DB1[(auth.db)]
        CU --> DB2[(urls.db)]
        CF --> DB3[(files.db)]
        CN --> DB4[(notes.db)]
    end
    
    subgraph "Prometheus Time Series"
        CP --> TSDB[(TSDB)]
    end
```

### Data Directory Structure

```
./data/
├── auth/
│   └── auth.db              # User accounts and credentials
├── urls/
│   └── urls.db              # Shortened URLs and click stats
├── files/
│   ├── files.db             # File metadata
│   └── uploads/             # Actual uploaded files
└── notes/
    └── notes.db             # Note content and metadata
```

### Why SQLite?

| Advantage | Description |
|-----------|-------------|
| **Simplicity** | No separate database server needed |
| **Portability** | Single file per database |
| **Performance** | Fast for read-heavy workloads |
| **Zero Configuration** | Works out of the box |
| **Easy Backup** | Just copy the .db files |

---

## Technology Stack Summary

### Complete Technology Overview

```mermaid
graph TB
    subgraph "Frontend"
        React[React 19]
        Vite[Vite]
        Nginx[Nginx]
    end
    
    subgraph "Backend"
        SpringBoot[Spring Boot 3.5]
        Kotlin[Kotlin]
        Micrometer[Micrometer]
    end
    
    subgraph "Database"
        SQLite[SQLite]
    end
    
    subgraph "Infrastructure"
        Docker[Docker]
        DockerCompose[Docker Compose]
    end
    
    subgraph "Monitoring"
        Prometheus[Prometheus]
        Grafana[Grafana]
    end
```

### Technology Details

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | React | 19 | UI framework |
| **Frontend** | Vite | Latest | Build tool & dev server |
| **Frontend** | Nginx | Alpine | Production web server |
| **Backend** | Spring Boot | 3.5 | Application framework |
| **Backend** | Kotlin | Latest | Programming language |
| **Backend** | Micrometer | Latest | Metrics instrumentation |
| **Database** | SQLite | Latest | Data persistence |
| **Container** | Docker | Latest | Containerization |
| **Orchestration** | Docker Compose | Latest | Multi-container management |
| **Metrics** | Prometheus | Latest | Metrics collection |
| **Visualization** | Grafana | Latest | Dashboards & alerting |
| **JRE** | Eclipse Temurin | 21 | Java runtime |

### Architecture Benefits Summary

| Principle | Benefit |
|-----------|---------|
| **Microservices** | Independent scaling, fault isolation, team autonomy |
| **Containerization** | Consistent environments, easy deployment, portability |
| **Monitoring** | Real-time visibility, proactive issue detection |
| **JWT Authentication** | Stateless, scalable, secure |
| **SQLite** | Simple, fast, no external dependencies |

---

## Quick Access URLs

After running `docker compose up`:

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:9000 | Create account |
| **Prometheus** | http://localhost:9090 | None required |
| **Grafana** | http://localhost:3000 | admin / admin |

---

## Deployment Commands

```bash
# 1. Build all services
./build.sh

# 2. Start everything
docker compose up -d

# 3. View logs
docker compose logs -f

# 4. Check service status
docker compose ps

# 5. Stop everything
docker compose down
```

---

**Digital Egypt Pioneers Initiative - DevOps Track**  
**URL Shortener Microservices Project**  
**Last Updated:** December 1, 2024
