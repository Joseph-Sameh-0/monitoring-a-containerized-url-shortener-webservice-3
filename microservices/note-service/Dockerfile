# Note Service Dockerfile
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the pre-built JAR file
COPY microservices/note-service/build/libs/note-service-0.0.1-SNAPSHOT.jar app.jar

# Create data directory
RUN mkdir -p /app/data

EXPOSE 9004

CMD ["java", "-jar", "app.jar"]
