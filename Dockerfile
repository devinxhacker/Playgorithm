FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    maven \
    curl \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME dynamically
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
ENV PATH=$JAVA_HOME/bin:$PATH

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Frontend environment variables
ENV VITE_API_BASE_URL=http://localhost:8081
ENV VITE_VISUALIZER_BASE_URL=http://localhost:3001

# Backend environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8081
ENV MONGODB_URI=mongodb+srv://dbUser:dbUser%40123@cluster0.vairb9u.mongodb.net/
ENV MONGODB_DATABASE=playgorithm
ENV JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
ENV JWT_EXPIRATION=86400000
ENV ADMIN_SIGNUP_SECRET=1234567890
ENV ADMIN_USERNAME=admin
ENV ADMIN_EMAIL=admin@playgorithm.com
ENV ADMIN_PASSWORD=Admin@123
ENV CORS_ALLOWED_ORIGINS=*
ENV GEMINI_API_KEY=AIzaSyDd_yGcYC89bmuuGQJLAPPl07H6m2iDgtk

# Create app directories
WORKDIR /app

# Copy and build Backend
COPY Backend /app/backend
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Copy and build Frontend
COPY Frontend /app/frontend
WORKDIR /app/frontend
RUN npm install

# Copy and build AlgorithmVisualizer (Next.js)
COPY AlgorithmVisualizer-master /app/visualizer
WORKDIR /app/visualizer
RUN npm install

# Copy supervisor config
COPY supervisord.conf /etc/supervisord.conf
RUN chmod 755 /etc/supervisord.conf

# Expose ports
EXPOSE 8081 5173 3001

# Start supervisor
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
