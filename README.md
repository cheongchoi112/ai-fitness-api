# AI Fitness API

A RESTful API for generating personalized fitness and diet plans using AI models (Gemini and Vertex AI).

## Overview

This API allows clients to:

- Generate personalized fitness plans based on user preferences, goals, and constraints
- Create and manage user profiles with comprehensive onboarding
- Track fitness progress including workouts and weight measurements
- Access API documentation through an interactive Swagger UI

## Features

- **AI-Powered Fitness Plans**: Generate customized workout and diet plans using Google's Gemini and Vertex AI models
- **User Management**: Create, read, update, and delete user profiles with comprehensive onboarding
- **Progress Tracking**: Track workouts, weight measurements, and fitness metrics over time
- **Firebase Authentication**: Secure API endpoints with Firebase Auth
- **API Documentation**: Interactive Swagger documentation for easy API exploration
- **MongoDB Integration**: Store user data and preferences

## Installation

1. Clone the repository:

```bash
git clone https://github.com/cheongchoi112/ai-fitness-api.git
cd ai-fitness-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project-id.iam.gserviceaccount.com
```

See [environment-variables.md](./docs/environment-variables.md) for more details.

## Usage

### Start the server:

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will be running at `http://localhost:3000`.

### API Endpoints

All protected endpoints require Firebase authentication. Include the Firebase ID token in the Authorization header as a Bearer token.

#### User Management

- `POST /api/users/onboarding` - Complete user onboarding and generate personalized fitness plan
- `POST /api/users/regenerate-plan` - Regenerate fitness plan for an existing user
- `GET /api/users/profile` - Get current user profile with fitness plan
- `DELETE /api/users/delete` - Delete user account and all associated data

#### Fitness Plans

- `POST /api/fitness/echo` - Test endpoint that echoes the request body
- `POST /api/fitness/generate-plan-gemini` - Generate fitness plan using Google's Gemini AI

#### Progress Tracking

- `GET /api/progress` - Get comprehensive progress data with metrics (includes weight and workout history)
- `POST /api/progress/workout` - Add a new workout completion record
- `PUT /api/progress/workout/{entryId}` - Update an existing workout entry
- `DELETE /api/progress/workout/{entryId}` - Delete a workout entry
- `GET /api/progress/workout-history` - Get user's workout history with optional date filtering
- `POST /api/progress/weight` - Add a new weight entry
- `PUT /api/progress/weight/{entryId}` - Update an existing weight entry
- `DELETE /api/progress/weight/{entryId}` - Delete a weight entry
- `GET /api/progress/weight-history` - Get user's weight history with optional date filtering

See [firebase-auth-guide.md](./docs/firebase-auth-guide.md) for authentication details.

### API Documentation

Access the Swagger UI documentation at:

```
http://localhost:3000/api-docs
```

## Sample Request & Response

### Request

```json
{
  "personalGoalsExperience": {
    "primaryFitnessGoal": "Build muscle",
    "currentWeightLbs": 170,
    "desiredWeightLbs": 185,
    "heightCms": 175,
    "currentFitnessLevel": "Intermediate",
    "ageGroup": "25-34"
  },
  "scheduleAvailability": {
    "daysPerWeekWorkout": "3-4",
    "preferredWorkoutTimes": "Evening"
  },
  "equipmentAccess": {
    "equipment": ["Dumbbells", "Resistance bands", "Full gym access"],
    "location": "At the gym"
  },
  "dietaryPreferences": {
    "primaryDietaryPreference": "High-protein",
    "restrictionsAllergies": ["Nut-free"]
  }
}
```

### Response

Returns a complete weekly fitness and nutrition plan in JSON format with detailed workouts and meal plans.

## Technologies Used

- Node.js with Express
- MongoDB for data storage
- Google Gemini AI & Vertex AI APIs
- Swagger for API documentation
- Docker for containerization
- Google Cloud Run for deployment

## Containerization & Deployment

This project is containerized with Docker and can be deployed to Google Cloud Run.

### Documentation

- **[Containerization Guide](docs/containerization-guide.md)**: Complete guide for containerizing and deploying the API
- **[Environment Variables](docs/environment-variables.md)**: Configuration for different environments
- **[Docker Commands](doc/docker-commands.md)**: Common Docker commands for this project

### Quick Docker Start

```bash
# Build the Docker image
docker build -t ai-fitness-api:latest .

# Run locally with Docker
docker run -p 3000:8080 -e MONGODB_URI="your_mongodb_uri" -e GEMINI_API_KEY="your_api_key" --name ai-fitness-api ai-fitness-api:latest

# Access at http://localhost:3000
```

For complete deployment instructions to Google Cloud, see the [Containerization Guide](docs/containerization-guide.md).

## License

[MIT](LICENSE)
