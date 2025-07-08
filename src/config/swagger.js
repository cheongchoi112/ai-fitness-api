import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Fitness API",
      version: "1.0.0",
      description:
        "API for generating personalized fitness and diet plans using AI",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "/api",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        UserOnboarding: {
          type: "object",
          properties: {
            userInfo: {
              type: "object",
              description:
                "User information object with dynamic properties. Only email is required.",
              properties: {
                email: {
                  type: "string",
                  description:
                    "User's email address (should match the one used in Firebase Auth)",
                },
              },
              additionalProperties: true,
              required: ["email"],
            },
            profile: {
              $ref: "#/components/schemas/UserProfile",
            },
          },
          required: ["userInfo", "profile"],
        },
        FitnessRequest: {
          type: "object",
          description: "Fitness plan request data",
        },
        FitnessResponse: {
          type: "object",
          description: "Generated fitness plan",
        },
        ProgressWeightEntry: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Unique identifier for this weight entry",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Date when the weight was recorded",
            },
            weight: {
              type: "number",
              description: "Weight value in user's preferred unit",
            },
          },
          required: ["date", "weight"],
        },
        ProgressWorkoutEntry: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Unique identifier for this workout entry",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Date when the workout was completed",
            },
            workoutId: {
              type: "string",
              description:
                "Optional reference to the specific workout in the fitness plan",
            },
            notes: {
              type: "string",
              description: "Optional notes about the workout",
            },
          },
          required: ["date"],
        },
        AddWeightRequest: {
          type: "object",
          properties: {
            date: {
              type: "string",
              format: "date-time",
              description: "Date when the weight was recorded",
            },
            weight: {
              type: "number",
              description: "Weight value in user's preferred unit",
            },
          },
          required: ["date", "weight"],
        },
        UpdateWeightRequest: {
          type: "object",
          properties: {
            date: {
              type: "string",
              format: "date-time",
              description: "Date when the weight was recorded",
            },
            weight: {
              type: "number",
              description: "Weight value in user's preferred unit",
            },
          },
        },
        AddWorkoutRequest: {
          type: "object",
          properties: {
            date: {
              type: "string",
              format: "date-time",
              description: "Date when the workout was completed",
            },
            workoutId: {
              type: "string",
              description:
                "Optional reference to the specific workout in the fitness plan",
            },
            notes: {
              type: "string",
              description: "Optional notes about the workout",
            },
          },
          required: ["date"],
        },
        UpdateWorkoutRequest: {
          type: "object",
          properties: {
            date: {
              type: "string",
              format: "date-time",
              description: "Date when the workout was completed",
            },
            workoutId: {
              type: "string",
              description:
                "Optional reference to the specific workout in the fitness plan",
            },
            notes: {
              type: "string",
              description: "Optional notes about the workout",
            },
          },
        },
        WeightHistoryResponse: {
          type: "object",
          properties: {
            weightHistory: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ProgressWeightEntry",
              },
              description: "Array of weight entries",
            },
          },
        },
        WorkoutHistoryResponse: {
          type: "object",
          properties: {
            workoutHistory: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ProgressWorkoutEntry",
              },
              description: "Array of workout completion records",
            },
          },
        },
        ProgressEntryResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Success message",
            },
            entry: {
              oneOf: [
                { $ref: "#/components/schemas/ProgressWeightEntry" },
                { $ref: "#/components/schemas/ProgressWorkoutEntry" },
              ],
              description: "The created or updated entry",
            },
          },
        },
        WorkoutCompletionResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Success message",
            },
            entry: {
              $ref: "#/components/schemas/ProgressWorkoutEntry",
            },
          },
        },
        UserProfileResponse: {
          type: "object",
          properties: {
            user: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  description: "MongoDB document ID",
                },
                firebaseUserId: {
                  type: "string",
                  description: "Firebase user ID",
                },
                userInfo: {
                  type: "object",
                  properties: {
                    email: {
                      type: "string",
                      description: "User's email",
                    },
                  },
                  additionalProperties: true,
                },
                profile: {
                  $ref: "#/components/schemas/UserProfile",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  description: "Timestamp when the user was created",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  description: "Timestamp when the user was last updated",
                },
              },
            },
            fitnessPlan: {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  description: "MongoDB document ID",
                },
                userId: {
                  type: "string",
                  description: "Firebase user ID",
                },
                plan: {
                  type: "object",
                  description: "Generated fitness plan",
                },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  description: "Timestamp when the plan was created",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  description: "Timestamp when the plan was last updated",
                },
              },
            },
          },
        },
        UserProfile: {
          type: "object",
          description: "User profile information",
          properties: {
            fitnessGoals: {
              type: "array",
              items: {
                type: "string",
              },
              description: "User's fitness goals",
              example: ["Build muscle", "Lose weight"],
            },
            currentWeight: {
              type: "string",
              description: "User's current weight in pounds",
              example: "200",
            },
            desiredWeight: {
              type: "string",
              description: "User's desired weight in pounds",
              example: "180",
            },
            height: {
              type: "string",
              description: "User's height in inches",
              example: "74",
            },
            fitnessLevel: {
              type: "string",
              description: "User's current fitness level",
              example: "Intermediate",
            },
            ageGroup: {
              type: "string",
              description: "User's age group",
              example: "25-34",
            },
            workoutDaysPerWeek: {
              type: "number",
              description: "Number of days per week available for workout",
              example: 4,
            },
            preferredWorkoutTime: {
              type: "string",
              description: "Preferred time of day for workouts",
              example: "Midday",
            },
            availableEquipment: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of available equipment",
              example: ["Dumbbells"],
            },
            dietaryPreferences: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of dietary preferences",
              example: ["No preference"],
            },
            dietaryRestrictions: {
              type: "array",
              items: {
                type: "string",
              },
              description: "List of dietary restrictions",
              example: [],
            },
            otherRestrictions: {
              type: "string",
              description: "Other restrictions as free text",
              example: "",
            },
            healthConsiderations: {
              type: "string",
              description: "Health considerations affecting workouts",
              example: "",
            },
            enjoyedWorkouts: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Types of workouts the user enjoys",
              example: ["HIIT", "Strength Training"],
            },
            workoutsToAvoid: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Types of workouts to avoid",
              example: [],
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Firebase Authentication token (JWT)",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  // Swagger page
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
    })
  );

  // Docs in JSON format
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  console.log("Swagger documentation available at /api-docs");
};
