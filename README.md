# Monitoring a containerized URL shortener webservice

## 👥 Team Members
- **Beshoy Ibrahim Asham Melek**
- **Hassan Saleh Hassan Gad**
- **Joseph Sameh Fouad Nasr**

---

## 📌 Project Overview
This project is a **URL Shortener** web application that allows users to convert long URLs into short, easy-to-share links. The application provides analytics for each shortened URL, such as the number of clicks and geographic information about users. The system is designed for reliability, scalability, and user-friendliness.

---

## 🎯 Project Objectives
- **Simplify Sharing:** Make long URLs concise and manageable for easier sharing.
- **Analytics:** Provide users with real-time analytics on link usage.
- **Security:** Prevent abuse through link validation and spam protection.
- **User Management:** Allow users to create accounts and manage their links.
- **Scalability:** Design the system to handle high volumes of URL shortening and redirection requests.

---

## 📂 Project Scope
- **Core Features:**
  - Shortening long URLs to unique short links.
  - Redirecting users from short links to the original URLs.
  - User registration, authentication, and dashboard.
  - Analytics dashboard for each link.
  - File sharing capabilities for images and PDFs.
  - Comprehensive monitoring with Prometheus and Grafana.
- **Out of Scope:**
  - Mobile applications.
  - Advanced third-party integrations (e.g., social media APIs).
  - Paid subscription models.

---

## 🗓 Project Plan (5 Weeks)

| Week | Milestone                                      |
|------|------------------------------------------------|
|  1   | Requirements gathering & system design         |
|  2   | Backend setup: Database & API development      |
|  3   | Frontend implementation: User interface        |
|  4   | Integration, link analytics & security         |
|  5   | Testing, deployment & documentation           |

---

## ✨ Features

### Core Functionality
* **URL Shortening** - Transform long URLs into short, shareable links
* **URL Redirection** - Fast and reliable redirection to original URLs
* **Click Tracking** - Monitor how many times your links are accessed

### User Features
* **User Authentication** - Secure registration and login system
* **Personal Dashboard** - View and manage all your shortened URLs
* **File Sharing** - Upload and share images and PDF files
* **URL History** - Track all your created short links

### DevOps & Monitoring
* **Prometheus Metrics** - Custom metrics for service health and usage patterns
* **Grafana Dashboards** - Real-time visualization of service metrics
* **Alerting** - Configurable alerts for error rates and performance thresholds
* **Data Persistence** - All data stored safely with Docker volumes

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Java 21 (for local development)
- Node.js 18+ (for frontend development)

### Running with Docker

The application uses a microservices architecture where each service runs independently.

1. Build the application:
   ```bash
   ./build.sh
   ```

2. Start all microservices:
   ```bash
   docker compose up
   ```

3. Access the services:
   - **Frontend**: http://localhost:9000
   - **Auth Service**: http://localhost:9001
   - **URL Service**: http://localhost:9002
   - **File Service**: http://localhost:9003
   - **Note Service**: http://localhost:9004
   - **Prometheus**: http://localhost:9090
   - **Grafana**: http://localhost:3000

### Development Mode

For frontend development with live reload:

1. Start the microservices:
   ```bash
   docker compose up auth-service url-service file-service note-service
   ```

2. Start the frontend dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Access the frontend at http://localhost:5173

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.5** - Modern Java framework
- **Kotlin** - Modern JVM language
- **SQLite** - Lightweight database
- **Micrometer** - Application metrics

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Modern CSS** - Responsive design with dark mode

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization

## 📊 Architecture

### Microservices Architecture

The application uses a **microservices architecture** where each service runs as a separate, independent component:

1. **Auth Service** (Port 9001) - User authentication and JWT management
2. **URL Service** (Port 9002) - URL shortening and redirection
3. **File Service** (Port 9003) - File upload and sharing
4. **Note Service** (Port 9004) - Note creation and sharing
5. **Frontend** (Port 9000) - React UI serving as the entry point
6. **Prometheus** (Port 9090) - Metrics collection from all services
7. **Grafana** (Port 3000) - Metrics visualization

Each service has its own database and can be scaled independently. All components run in Docker containers and communicate through a dedicated network.

## 📖 API Documentation

### Shorten URL
```
POST /shorten
Content-Type: application/json

{
  "long_url": "https://example.com/very/long/url"
}
```

### Redirect to Original URL
```
GET /{shortCode}
```

### Get All URLs (Admin)
```
GET /admin/urls
```

## 🔐 Security

- User authentication with secure password hashing
- JWT token-based session management
- Input validation and sanitization
- CORS configuration for API security

## 📚 Documentation

### DevOps Documentation
For comprehensive information about the application's architecture, infrastructure, and monitoring:

**[📘 DEVOPS.md](DEVOPS.md)** - Complete DevOps guide covering:
- 🏗️ Architecture overview with diagrams
- 🐳 Docker containerization explained
- 📊 Prometheus monitoring setup
- 📈 Grafana visualization and alerting
- 🚀 Deployment guide with step-by-step instructions
- 🔧 Troubleshooting and best practices

### Additional Documentation
- [MICROSERVICES.md](MICROSERVICES.md) - Microservices architecture details
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide

## 📝 License

This project is part of the Digital Egypt Pioneers Initiative DevOps Track.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

## 📝 Short Project Description
A modern, reliable, and secure web application enabling users to shorten URLs, manage their links, and view real-time analytics. Designed with scalability and user experience in mind, this URL shortener uses a microservices architecture and features comprehensive monitoring with Prometheus and Grafana.
