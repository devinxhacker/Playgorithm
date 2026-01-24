FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    openjdk-17-jre-headless \
    curl \
    supervisor \
    nginx \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME dynamically based on architecture
RUN ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "amd64" ]; then \
      echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" >> /etc/profile.d/java.sh; \
    else \
      echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64" >> /etc/profile.d/java.sh; \
    fi && \
    chmod +x /etc/profile.d/java.sh

ENV PATH=/usr/lib/jvm/java-17-openjdk-amd64/bin:/usr/lib/jvm/java-17-openjdk-arm64/bin:$PATH

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# NOTE: All environment variables should be passed at runtime via:
# - docker run --env-file .env
# - docker-compose with env_file

# Create app directories
WORKDIR /app

WORKDIR /app/backend
COPY Backend/target/Playgorithm-0.0.1-SNAPSHOT.jar /app/backend/app.jar
# Create uploads directory for community chat images
RUN mkdir -p /app/backend/uploads/messages

WORKDIR /app/frontend
COPY Frontend/dist /app/frontend/dist
COPY supervisord.conf /etc/supervisord.conf
RUN chmod 755 /etc/supervisord.conf
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 10000
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
