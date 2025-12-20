# HTTPS Configuration for Playgorithm Backend

## Overview
The backend is now configured to support both HTTP and HTTPS protocols for secure communication.

## Configuration Changes

### 1. SSL Certificate
- A self-signed SSL certificate has been generated for development
- Location: `src/main/resources/keystore.p12`
- Password: `playgorithm`
- Validity: 365 days

### 2. Server Ports
- **HTTPS**: `8443` (primary secure port)
- **HTTP**: `8080` (redirects to HTTPS port 8443)

### 3. Security Enhancements
- Fixed the "//" URL rejection error by configuring HttpFirewall
- Added support for URL-encoded slashes and special characters
- Configured CORS to allow both HTTP and HTTPS origins

## Accessing the Backend

### HTTPS (Recommended)
```
https://localhost:8443/api/...
```

### HTTP (Will redirect to HTTPS)
```
http://localhost:8080/api/...
```

## Frontend Configuration

Update your frontend API base URL to use HTTPS:

```javascript
// Example for axios or fetch
const API_BASE_URL = 'https://localhost:8443/api';
```

### Browser Warning
Since this is a self-signed certificate, browsers will show a security warning. For development:
1. Click "Advanced" 
2. Click "Proceed to localhost (unsafe)"

This is normal for development environments.

## Regenerating SSL Certificate

If you need to regenerate the certificate:

```bash
cd Backend
./generate-ssl-cert.sh
```

## Production Deployment

For production, you should:

1. **Use a real SSL certificate** from a Certificate Authority (e.g., Let's Encrypt)

2. **Uncomment the HTTPS enforcement** in SecurityConfig.java:
   ```java
   .requiresChannel(channel -> channel
       .anyRequest().requiresSecure()
   )
   ```

3. **Update application.properties** with production certificate details:
   ```properties
   server.ssl.key-store=/path/to/production-keystore.p12
   server.ssl.key-store-password=<strong-password>
   ```

4. **Update CORS origins** to include your production domain

## Troubleshooting

### Issue: Browser won't connect to HTTPS
- **Solution**: Accept the self-signed certificate warning in your browser

### Issue: "//" in URL causing errors
- **Solution**: The HttpFirewall has been configured to allow double slashes

### Issue: CORS errors with HTTPS
- **Solution**: Both HTTP and HTTPS origins are now configured in CORS settings

### Issue: Port 8443 already in use
- **Solution**: Stop any other services using port 8443 or change the port in application.properties

## Security Notes

- The self-signed certificate is for **development only**
- Never commit real production certificates to version control
- Use environment variables for sensitive configuration in production
- Consider using Spring Cloud Config or AWS Secrets Manager for production secrets
