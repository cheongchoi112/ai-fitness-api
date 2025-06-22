# Environment Variables Documentation

This document provides information about the environment variables used in the AI Fitness API application.

## Required Environment Variables

### `PORT`

- **Description**: The port on which the Express server will listen
- **Default**: 8080 (recommended for Google Cloud Run)
- **Example**: `PORT=8080`

### `MONGODB_URI`

- **Description**: Connection string for MongoDB database
- **Format**: `mongodb+srv://<username>:<password>@<host>/<database>?<options>`
- **Example**: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai_fitness_coach?retryWrites=true&w=majority`

### `GEMINI_API_KEY`

- **Description**: API key for Google's Gemini AI service
- **How to obtain**: Create an API key from the Google AI Studio (https://ai.google.dev/)
- **Example**: `GEMINI_API_KEY=AIza...`

## Firebase Authentication Environment Variables

### `FIREBASE_API_KEY`

- **Description**: API key for your Firebase project
- **How to obtain**: From Firebase console > Project Settings > General
- **Example**: `FIREBASE_API_KEY=AIzaSyA...`

### `FIREBASE_AUTH_DOMAIN`

- **Description**: Firebase authentication domain
- **Format**: `<project-id>.firebaseapp.com`
- **Example**: `FIREBASE_AUTH_DOMAIN=ai-fitness-api.firebaseapp.com`

### `FIREBASE_PROJECT_ID`

- **Description**: Your Firebase project ID
- **How to obtain**: From Firebase console > Project Settings > General
- **Example**: `FIREBASE_PROJECT_ID=ai-fitness-api`

### `FIREBASE_ADMIN_PRIVATE_KEY`

- **Description**: Private key for Firebase Admin SDK service account
- **How to obtain**: From Firebase console > Project Settings > Service Accounts > Generate new private key
- **Example**: `FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMII..."`

### `FIREBASE_ADMIN_CLIENT_EMAIL`

- **Description**: Client email for Firebase Admin SDK service account
- **How to obtain**: From Firebase console > Project Settings > Service Accounts
- **Example**: `FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@ai-fitness-api.iam.gserviceaccount.com`

## Optional Environment Variables

### `NODE_ENV`

- **Description**: Defines the environment in which the application is running
- **Values**: `development`, `production`, `test`
- **Default**: `development`
- **Example**: `NODE_ENV=production`

## Environment Variables in Different Environments

### Local Development

- Use a local `.env` file

### Docker Development

- Pass environment variables using the `-e` flag or `--env-file`
- Example: `docker run -p 3000:8080 -e MONGODB_URI="..." -e GEMINI_API_KEY="..." ai-fitness-api`

### Google Cloud Run

- Set environment variables in the Cloud Run service configuration
- Use Secret Manager for sensitive values like API keys and connection strings

## Security Notes

- Never commit the `.env` file to version control
- In production, use a secrets management solution like Google Secret Manager
- Rotate API keys and secrets regularly
- Consider using IAM roles for service-to-service authentication when possible
