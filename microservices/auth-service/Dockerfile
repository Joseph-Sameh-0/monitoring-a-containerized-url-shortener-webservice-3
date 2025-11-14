# Auth Service Dockerfile
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the pre-built JAR file
COPY microservices/auth-service/build/libs/auth-service-0.0.1-SNAPSHOT.jar app.jar

# Create data directory
RUN mkdir -p /app/data

EXPOSE 9001

CMD ["java", "-jar", "app.jar"]
