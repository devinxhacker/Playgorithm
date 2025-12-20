#!/bin/bash

# Generate self-signed SSL certificate for development
# This creates a PKCS12 keystore file for Spring Boot

echo "Generating self-signed SSL certificate for development..."

keytool -genkeypair \
  -alias playgorithm \
  -keyalg RSA \
  -keysize 2048 \
  -storetype PKCS12 \
  -keystore src/main/resources/keystore.p12 \
  -storepass playgorithm \
  -validity 365 \
  -dname "CN=localhost, OU=Development, O=Playgorithm, L=City, ST=State, C=US"

echo "SSL certificate generated successfully!"
echo "Keystore location: src/main/resources/keystore.p12"
echo "Keystore password: playgorithm"
echo ""
echo "Your backend will now run on https://localhost:8443"
