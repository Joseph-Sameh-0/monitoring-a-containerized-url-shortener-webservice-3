# DevOps Quick Reference Guide

> Quick reference for common tasks and commands. For comprehensive documentation, see [DEVOPS.md](DEVOPS.md)

## 🚀 Quick Start

```bash
# 1. Clone and navigate to repository
git clone https://github.com/Joseph-Sameh-0/monitoring-a-containerized-url-shortener-webservice-3.git
cd monitoring-a-containerized-url-shortener-webservice-3

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Build services
./build.sh

# 4. Start all services
docker compose up -d

# 5. View logs
docker compose logs -f
```

## 📋 Essential Commands

### Docker Compose Operations

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart all services
docker compose restart

# View running containers
docker compose ps

# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f auth-service

# Rebuild and restart a service
docker compose up -d --build auth-service

# Scale a service
docker compose up -d --scale url-service=3
```

### Container Management

```bash
# List all containers
docker ps

# Execute command in container
docker compose exec auth-service sh

# View container resource usage
docker stats

# Remove all stopped containers
docker compose down
```

### Troubleshooting

```bash
# Check container logs for errors
docker compose logs auth-service | grep -i error

# Restart a problematic service
docker compose restart auth-service

# Rebuild a service from scratch
docker compose build --no-cache auth-service
docker compose up -d auth-service

# Clean up everything (INCLUDING DATA!)
docker compose down -v
```

## 🌐 Service URLs

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| Frontend | http://localhost:9000 | Register/Login |
| Auth Service | http://localhost:9001 | - |
| URL Service | http://localhost:9002 | - |
| File Service | http://localhost:9003 | - |
| Note Service | http://localhost:9004 | - |
| Prometheus | http://localhost:9090 | None |
| Grafana | http://localhost:3000 | admin/admin |

## 🔍 Health Checks

```bash
# Check all services are healthy
curl http://localhost:9001/actuator/health
curl http://localhost:9002/actuator/health
curl http://localhost:9003/actuator/health
curl http://localhost:9004/actuator/health

# Check metrics endpoints
curl http://localhost:9001/actuator/prometheus | head -20

# Check Prometheus targets
# Navigate to: http://localhost:9090/targets
```

## 📊 Monitoring

### Prometheus Queries (http://localhost:9090)

```promql
# Request rate per service
rate(http_server_requests_seconds_count[5m])

# Average response time
rate(http_server_requests_seconds_sum[5m]) / rate(http_server_requests_seconds_count[5m])

# Error rate
rate(http_server_requests_seconds_count{status=~"5.."}[5m])

# Memory usage
jvm_memory_used_bytes{area="heap"}

# CPU usage
system_cpu_usage
```

### Grafana (http://localhost:3000)

1. Login with credentials from `.env` file
2. Navigate to **Dashboards** → **URL Shortener Dashboard**
3. View pre-configured panels for all metrics
4. Set up alerts under **Alerting** → **Alert Rules**

## 🗂️ Data Management

### Backup

```bash
# Backup all data
tar -czf backup-$(date +%Y%m%d).tar.gz ./data/

# Backup Prometheus data
docker run --rm -v monitoring-a-containerized-url-shortener-webservice-3_prometheus_data:/data \
  -v $(pwd):/backup alpine tar -czf /backup/prometheus-backup.tar.gz /data
```

### Restore

```bash
# Restore application data
tar -xzf backup-20240101.tar.gz

# Restore Prometheus data
docker run --rm -v monitoring-a-containerized-url-shortener-webservice-3_prometheus_data:/data \
  -v $(pwd):/backup alpine tar -xzf /backup/prometheus-backup.tar.gz -C /
```

## 🔧 Configuration

### Environment Variables (.env)

```bash
# JWT Secret (minimum 32 characters)
JWT_SECRET=your-secure-secret-key-here

# Grafana
GRAFANA_USER=admin
GRAFANA_PASSWORD=your-secure-password

# Email Alerts (optional)
EMAIL_ADDRESSES=alerts@example.com
GF_SMTP_ENABLED=true
GF_SMTP_HOST=smtp.gmail.com:587
GF_SMTP_USER=your-email@gmail.com
GF_SMTP_PASSWORD=your-app-password
```

### Port Configuration

If you need to change ports, edit `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # Change 9000 to 8080
```

## 🐛 Common Issues

### Port Already in Use

```bash
# Find what's using the port
sudo lsof -i :9001

# Kill the process or change port in docker-compose.yml
```

### Service Won't Start

```bash
# Check logs for errors
docker compose logs service-name

# Rebuild the service
docker compose build --no-cache service-name
docker compose up -d service-name
```

### Prometheus Not Scraping

```bash
# Check Prometheus targets
# Visit: http://localhost:9090/targets

# Verify metrics endpoint is accessible
curl http://localhost:9001/actuator/prometheus

# Restart Prometheus
docker compose restart prometheus
```

### Grafana Shows "No Data"

1. Check Prometheus data source: **Settings → Data Sources → Test**
2. Verify time range in dashboard (top right)
3. Check if services are exposing metrics
4. Verify PromQL queries are correct

## 🔄 Development Workflow

### Local Development

```bash
# Start only backend services
docker compose up -d auth-service url-service file-service note-service

# Run frontend in dev mode
cd frontend
npm install
npm run dev
# Access at http://localhost:5173
```

### Run Individual Service Locally

```bash
# Example: Run auth-service locally
cd microservices/auth-service
../gradlew bootRun
```

### Testing

```bash
# Run tests for a service
cd microservices/auth-service
../gradlew test

# Run all tests
cd microservices
./gradlew test
```

## 📈 Performance Tuning

### Limit Container Resources

Edit `docker-compose.yml`:

```yaml
services:
  auth-service:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          memory: 256M
```

### Prometheus Data Retention

Edit `docker-compose.yml`:

```yaml
prometheus:
  command:
    - '--storage.tsdb.retention.time=30d'
    - '--storage.tsdb.retention.size=10GB'
```

## 🧹 Cleanup

```bash
# Stop containers (keep data)
docker compose down

# Stop containers and remove volumes (DELETE ALL DATA!)
docker compose down -v

# Remove unused Docker resources
docker system prune -a

# Remove specific volume
docker volume rm monitoring-a-containerized-url-shortener-webservice-3_prometheus_data
```

## 📚 Further Reading

- **Comprehensive Guide**: [DEVOPS.md](DEVOPS.md)
- **Microservices Details**: [MICROSERVICES.md](MICROSERVICES.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)

---

**Tip**: Keep this reference handy while working with the application!
