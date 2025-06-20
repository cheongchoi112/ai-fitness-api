# AI Fitness API - Docker Commands Reference

## Docker Installation Verification

```bash
docker --version
```

Expected output: Docker version X.X.X, build XXXXX (or similar)

## Build Docker Image

```bash
docker build -t ai-fitness-api:latest .
```

## Run Docker Container Locally

### Option 1: Using .env File (Recommended for Development)

If you have all your environment variables in your `.env` file:

```bash
docker run -p 3000:8080 --env-file .env --name ai-fitness-api ai-fitness-api:latest
```

This will load all variables from your `.env` file into the container at runtime.

### Option 2: Specifying Environment Variables Explicitly

If you need to specify environment variables directly:

```bash
docker run -p 3000:8080 \
  -e MONGODB_URI="your_mongodb_connection_string" \
  -e GEMINI_API_KEY="your_api_key" \
  -e FIREBASE_API_KEY="your_firebase_api_key" \
  -e FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com" \
  -e FIREBASE_PROJECT_ID="your-project-id" \
  -e FIREBASE_ADMIN_PRIVATE_KEY="your_private_key" \
  -e FIREBASE_ADMIN_CLIENT_EMAIL="firebase-adminsdk-xxxx@your-project-id.iam.gserviceaccount.com" \
  --name ai-fitness-api ai-fitness-api:latest
```

### Option 3: Using a Service Account File (Best for Firebase Admin SDK)

For Firebase Admin credentials, mounting a service account file avoids environment variable formatting issues:

```bash
docker run -p 3000:8080 \
  --env-file .env \
  -v "$(pwd)/src/config/keys/serviceAccountKey.json:/app/src/config/keys/serviceAccountKey.json" \
  --name ai-fitness-api ai-fitness-api:latest
```

> **Important Note**: Environment variables from your local machine or `.env` file are **NOT** automatically included in the Docker image during build. They must be provided at runtime using one of the methods above.

## Docker Resource Configuration

For local development, configure Docker Desktop with appropriate resources:

- Memory: 2GB minimum
- CPU: 2 cores minimum
- Swap: 1GB minimum

## Verify Container is Running

```bash
docker ps
```

## View Container Logs

```bash
docker logs ai-fitness-api
```

## Stop Container

```bash
docker stop ai-fitness-api
```

## Remove Container

```bash
docker rm ai-fitness-api
```

---

**Note:** These commands are for local Docker development. Production deployment will use Google Cloud services.
