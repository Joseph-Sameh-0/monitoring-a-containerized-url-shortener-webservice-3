# URL Service Dockerfile
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the pre-built JAR file
COPY microservices/url-service/build/libs/url-service-0.0.1-SNAPSHOT.jar app.jar

# Create data directory
RUN mkdir -p /app/data

EXPOSE 9002

CMD ["java", "-jar", "app.jar"]
