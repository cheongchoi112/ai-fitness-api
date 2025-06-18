# AI Fitness API - Containerization and Deployment Documentation

This document provides comprehensive details about the containerization and deployment process for the AI Fitness API project.

## 1. Build and Deployment Process

### Local Development

#### Prerequisites

- Node.js 18+ installed
- Docker Desktop installed and running
- MongoDB access (local or Atlas)
- Google Gemini API key

#### Local Build Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-fitness-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Create a `.env` file based on `.env.example`
   - Fill in your MongoDB URI and Gemini API key

4. **Run locally**
   ```bash
   npm run dev
   ```

### Docker Build Process

1. **Build Docker image**

   ```bash
   docker build -t ai-fitness-api:latest .
   ```

2. **Run container locally**

   ```bash
   docker run -p 3000:8080 -e MONGODB_URI="your_mongodb_uri" -e GEMINI_API_KEY="your_api_key" --name ai-fitness-api ai-fitness-api:latest
   ```

3. **Test API endpoints**
   - Open `http://localhost:3000/api-docs` to access Swagger UI
   - Test the `/api/fitness/echo` endpoint to verify functionality

### Google Cloud Deployment

1. **Set up Google Cloud environment**

   - Install Google Cloud SDK
   - Authenticate with `gcloud auth login`
   - Set project with `gcloud config set project ai-fitness-7e94a`

2. **Configure Artifact Registry**

   - Enable Artifact Registry API
   - Create repository: `gcloud artifacts repositories create ai-fitness-repo --repository-format=docker --location=us-central1`

3. **Push image to Google Cloud**

   ```bash
   docker tag ai-fitness-api:latest us-central1-docker.pkg.dev/ai-fitness-7e94a/ai-fitness-repo/ai-fitness-api:latest
   docker push us-central1-docker.pkg.dev/ai-fitness-7e94a/ai-fitness-repo/ai-fitness-api:latest
   ```

4. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy ai-fitness-api \
     --image us-central1-docker.pkg.dev/ai-fitness-7e94a/ai-fitness-repo/ai-fitness-api:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="MONGODB_URI=your_mongodb_uri,GEMINI_API_KEY=your_api_key,RUNNING_IN_DOCKER=true"
   ```

## 2. Common Operations Runbook

### How to Update and Redeploy the Application

1. **Make code changes**
2. **Rebuild Docker image**
   ```bash
   docker build -t ai-fitness-api:latest .
   ```
3. **Tag and push to Artifact Registry**
   ```bash
   docker tag ai-fitness-api:latest us-central1-docker.pkg.dev/ai-fitness-7e94a/ai-fitness-repo/ai-fitness-api:latest
   docker push us-central1-docker.pkg.dev/ai-fitness-7e94a/ai-fitness-repo/ai-fitness-api:latest
   ```
4. **Update Cloud Run service**
   ```bash
   gcloud run services update ai-fitness-api --image us-central1-docker.pkg.dev/ai-fitness-7e94a/ai-fitness-repo/ai-fitness-api:latest --region us-central1
   ```

### How to Update Environment Variables

```bash
gcloud run services update ai-fitness-api --set-env-vars="NEW_VAR=value,UPDATED_VAR=new_value" --region us-central1
```

### How to View Application Logs

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ai-fitness-api" --limit 50
```

### How to Rollback to Previous Version

```bash
gcloud run services update ai-fitness-api --to-revision=ai-fitness-api-00001 --region us-central1
```

## 3. Container Specifications and Resource Requirements

### Docker Container Specifications

- **Base Image**: Node.js 20 Alpine
- **Exposed Port**: 8080
- **Working Directory**: /app
- **User**: node (non-root)
- **Entry Point**: node src/server.js

### Resource Requirements

#### Development Environment

- **CPU**: 1 core minimum
- **Memory**: 512 MB minimum
- **Disk**: 1 GB minimum

#### Production Environment (Cloud Run)

- **CPU**: 1-2 cores (automatically scales)
- **Memory**: 512 MB - 2 GB
- **Concurrency**: 80 requests per instance
- **Scaling**: 0-100 instances based on load

### External Dependencies

- **MongoDB**: Atlas cluster or equivalent with 512 MB+ RAM
- **Google Gemini API**: Basic tier or higher
- **Network**: Outbound connections to MongoDB and Google AI APIs

### Performance Considerations

- Initial cold start: ~2-4 seconds
- Warm request latency: ~100-500ms (API dependent)
- Concurrent users supported: ~500 per instance
- Maximum recommended traffic: 5000 req/min with default scaling

---

Last Updated: June 18, 2025
