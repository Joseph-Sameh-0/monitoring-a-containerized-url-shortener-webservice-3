# File Service Dockerfile
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the pre-built JAR file
COPY microservices/file-service/build/libs/file-service-0.0.1-SNAPSHOT.jar app.jar

# Create data directory
RUN mkdir -p /app/data

EXPOSE 9003

CMD ["java", "-jar", "app.jar"]
