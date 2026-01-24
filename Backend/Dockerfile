# ==========================================
# Backend Dockerfile - Spring Boot Application
# ==========================================

# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml first to leverage Docker cache for dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime image (using non-alpine for ARM64 compatibility)
FROM eclipse-temurin:17-jre

# Create non-root user for security
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

# Copy the jar from builder stage
COPY --from=builder /app/target/Playgorithm-0.0.1-SNAPSHOT.jar app.jar

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${SERVER_PORT:-8081}/actuator/health || exit 1

# Expose backend port
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
