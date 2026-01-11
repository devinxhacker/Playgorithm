FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    openjdk-17-jre-headless \
    curl \
    supervisor \
    nginx \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set JAVA_HOME dynamically
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
ENV PATH=$JAVA_HOME/bin:$PATH

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Frontend environment variables
ENV VITE_API_BASE_URL=http://localhost:10000/

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

# Copy prebuilt Backend jar (build locally first)
WORKDIR /app/backend
COPY Backend/target/Playgorithm-0.0.1-SNAPSHOT.jar /app/backend/app.jar

# Copy prebuilt Frontend dist (vite build locally)
WORKDIR /app/frontend
COPY Frontend/dist /app/frontend/dist

# Copy supervisor config
COPY supervisord.conf /etc/supervisord.conf
RUN chmod 755 /etc/supervisord.conf

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 10000 for Render
EXPOSE 10000

# Start supervisor
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]


#DEBIAN_FRONTEND=noninteractive
# JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
# PATH=$JAVA_HOME/bin:$PATH
# VITE_API_BASE_URL=http://localhost:8081
# VITE_VISUALIZER_BASE_URL=http://localhost:3001
# SPRING_PROFILES_ACTIVE=prod
# SERVER_PORT=8081
# MONGODB_URI=mongodb+srv://dbUser:dbUser%40123@cluster0.vairb9u.mongodb.net/
# MONGODB_DATABASE=playgorithm
# JWT_SECRET=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
# JWT_EXPIRATION=86400000
# ADMIN_SIGNUP_SECRET=1234567890
# ADMIN_USERNAME=admin
# ADMIN_EMAIL=admin@playgorithm.com
# ADMIN_PASSWORD=Admin@123
# CORS_ALLOWED_ORIGINS=*
# GEMINI_API_KEY=AIzaSyDd_yGcYC89bmuuGQJLAPPl07H6m2iDgtk
