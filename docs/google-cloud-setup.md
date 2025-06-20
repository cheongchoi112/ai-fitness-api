# Google Cloud Setup Guide

This guide provides instructions for setting up Google Cloud for deploying the AI Fitness API.

## Prerequisites

Before starting, ensure you have:

- Docker Desktop installed and working locally
- Your application containerized and tested locally
- A Google account with billing enabled

## 1. Install Google Cloud SDK

### Windows Installation

1. Download the Google Cloud SDK installer:

   - Visit: https://cloud.google.com/sdk/docs/install
   - Download the Windows installer

2. Run the installer and follow the prompts:

   - Keep all default components selected
   - Choose whether to report usage statistics
   - When prompted, select "Log in with your Google account"

3. Verify installation by opening a new PowerShell window and running:
   ```powershell
   gcloud --version
   ```

## 2. Configure Google Cloud Authentication

1. Log in to Google Cloud:

   ```powershell
   gcloud auth login
   ```

   - This will open a browser window
   - Log in with your Google account
   - Allow the permissions requested

2. Set up application default credentials (for local development):
   ```powershell
   gcloud auth application-default login
   ```

## 3. Use Your Existing Google Cloud Project

1. Set your existing project as the default:

   ```powershell
   gcloud config set project ai-fitness-7e94a
   ```

2. Verify your project is selected:

   ```powershell
   gcloud config get-value project
   ```

   The output should show: `ai-fitness-7e94a`

   > **Note:** This sets the project configuration in your local Google Cloud CLI. It stores these settings in your user profile configuration (typically in ~/.config/gcloud/ on Linux/Mac or %APPDATA%\gcloud\ on Windows). This configuration tells all subsequent gcloud commands which project to operate on.

3. Enable required APIs:
   ```powershell
   gcloud services enable artifactregistry.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

## 4. Set Up Artifact Registry for Docker Images

1. Create a Docker repository:

   ```powershell
   gcloud artifacts repositories create ai-fitness-repo --repository-format=docker --location=us-central1 --description="AI Fitness API Docker repository"
   ```

   > **Note:** This creates an Artifact Repository **in Google Cloud** (not locally) within your selected project (`ai-fitness-7e94a`). The repository will be created in the us-central1 region and will be visible in the Google Cloud Console under "Artifact Registry". This is where your Docker images will be stored in the cloud.

2. Configure Docker authentication:
   ```powershell
   gcloud auth configure-docker us-central1-docker.pkg.dev
   ```

## 5. Pushing Your Docker Image to Google Cloud

Now that you have set up Google Cloud, follow these steps to push your Docker image:

1. Tag your local Docker image for Artifact Registry:

   ```powershell
   docker tag ai-fitness-api:latest us-central1-docker.pkg.dev/ai-fitness-7e94a/ai-fitness-repo/ai-fitness-api:latest
   ```

2. Push the image to Google Artifact Registry:

   ```powershell
   docker push us-central1-docker.pkg.dev/ai-fitness-7e94a/ai-fitness-repo/ai-fitness-api:latest
   ```

3. Verify the image was pushed successfully:

   ```powershell
   gcloud artifacts docker images list us-central1-docker.pkg.dev/ai-fitness-7e94a/ai-fitness-repo
   ```

## 6. Deploy to Cloud Run

1. Deploy your container to Cloud Run:

   ```powershell
   gcloud run deploy ai-fitness-api --image us-central1-docker.pkg.dev/ai-fitness-7e94a/ai-fitness-repo/ai-fitness-api:latest --platform managed --region us-central1 --allow-unauthenticated
   ```

2. When prompted, type 'y' to confirm the deployment

3. Set environment variables:

   ```powershell
   gcloud run services update ai-fitness-api --set-env-vars="MONGODB_URI=your_mongodb_uri,GEMINI_API_KEY=your_gemini_api_key,FIREBASE_API_KEY=your_firebase_api_key,FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com,FIREBASE_PROJECT_ID=your-project-id" --region us-central1
   ```

   Note: Unlike Docker local development, you CANNOT use a `.env` file directly with Cloud Run. Environment variables must be explicitly set. For Firebase Admin credentials specifically, it's recommended to use Secret Manager (below) rather than environment variables due to formatting issues with the private key.

   a) Set environment variables through Google Cloud Console UI instead of CLI

   b) Use Secret Manager for sensitive credentials (recommended for production):

   ```powershell
   # Create a secret for Firebase Admin credentials
   gcloud secrets create firebase-admin-key --data-file="./serviceAccountKey.json"

   # Grant the Cloud Run service access to the secret
   gcloud secrets add-iam-policy-binding firebase-admin-key \
       --member="serviceAccount:your-service-account@your-project.iam.gserviceaccount.com" \
       --role="roles/secretmanager.secretAccessor"

   # Mount the secret in your Cloud Run service
   gcloud run services update ai-fitness-api \
       --add-volume=name=firebase-creds,secret=firebase-admin-key,version=latest \
       --add-volume-mount=volume=firebase-creds,mount-path=/app/src/config/keys/ \
       --region=us-central1
   ```

4. Get the deployed service URL:

   ```powershell
   gcloud run services describe ai-fitness-api --platform managed --region us-central1 --format='value(status.url)'
   ```

## 7. Configure Service Account (Optional)

For better security, you can create a dedicated service account:

1. Create service account:

   ```powershell
   gcloud iam service-accounts create ai-fitness-service-account --display-name="AI Fitness Service Account"
   ```

2. Grant necessary permissions:
   ```powershell
   gcloud projects add-iam-policy-binding ai-fitness-7e94a --member="serviceAccount:ai-fitness-service-account@ai-fitness-7e94a.iam.gserviceaccount.com" --role="roles/run.invoker"
   ```

## Monitoring Your Deployment

After deploying your application:

1. View Cloud Run service metrics:

   ```powershell
   gcloud run services describe ai-fitness-api --region us-central1
   ```

2. View logs:

   ```powershell
   gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ai-fitness-api" --limit 10
   ```

3. Test your API:
   - Use the URL returned from the deployment command
   - Example: `https://ai-fitness-api-abcd123-uc.a.run.app/api/fitness/echo`

## Troubleshooting

- If you encounter quota errors, verify that billing is enabled for your project
- For authentication issues, try `gcloud auth revoke` and then log in again
- For project creation errors, try a different project ID or check quota limits
