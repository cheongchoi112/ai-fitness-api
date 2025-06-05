# AI Fitness API

A RESTful API for generating personalized fitness and diet plans using AI models (Gemini and Vertex AI).

## Overview

This API allows clients to:

- Generate personalized fitness plans based on user preferences, goals, and constraints
- Create and manage user profiles
- Access API documentation through an interactive Swagger UI

## Features

- **AI-Powered Fitness Plans**: Generate customized workout and diet plans using Google's Gemini and Vertex AI models
- **User Management**: Create, read, update, and delete user profiles
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
```

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

#### Fitness Plans

- `POST /api/fitness/echo` - Test endpoint that echoes the request body
- `POST /api/fitness/gemini` - Generate fitness plan using Google's Gemini AI
- `POST /api/fitness/vertexai` - Generate fitness plan using Vertex AI

#### User Management

- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user details
- `DELETE /api/users/:id` - Delete a user

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

## License

[MIT](LICENSE)
