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

```bash
docker run -p 3000:8080 -e MONGODB_URI="your_mongodb_connection_string" -e GEMINI_API_KEY="your_api_key" --name ai-fitness-api ai-fitness-api:latest
```

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
