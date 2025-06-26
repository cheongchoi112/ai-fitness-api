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
              type: "object",
              properties: {
                personalGoalsExperience: {
                  type: "object",
                  properties: {
                    primaryFitnessGoal: {
                      type: "string",
                      description: "User's primary fitness goal",
                    },
                    currentWeightLbs: {
                      type: "number",
                      description: "User's current weight in pounds",
                    },
                    desiredWeightLbs: {
                      type: "number",
                      description: "User's desired weight in pounds",
                    },
                    heightCms: {
                      type: "number",
                      description: "User's height in centimeters",
                    },
                    currentFitnessLevel: {
                      type: "string",
                      description: "User's current fitness level",
                    },
                    ageGroup: {
                      type: "string",
                      description: "User's age group",
                    },
                  },
                },
                scheduleAvailability: {
                  type: "object",
                  properties: {
                    daysPerWeekWorkout: {
                      type: "string",
                      description:
                        "Number of days per week available for workout",
                    },
                    preferredWorkoutTimes: {
                      type: "string",
                      description: "Preferred times of day for workouts",
                    },
                  },
                },
                equipmentAccess: {
                  type: "object",
                  properties: {
                    equipment: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "List of available equipment",
                    },
                    location: {
                      type: "string",
                      description: "Workout location",
                    },
                  },
                },
                dietaryPreferences: {
                  type: "object",
                  properties: {
                    primaryDietaryPreference: {
                      type: "string",
                      description: "Primary dietary preference",
                    },
                    restrictionsAllergies: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "List of dietary restrictions and allergies",
                    },
                  },
                },
                healthConsiderations: {
                  type: "object",
                  properties: {
                    medicalConditions: {
                      type: "string",
                      description: "Any medical conditions affecting workouts",
                    },
                    workoutsToAvoid: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "Types of workouts to avoid",
                    },
                  },
                },
                preferencesMotivation: {
                  type: "object",
                  properties: {
                    enjoyedWorkoutTypes: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "Types of workouts the user enjoys",
                    },
                  },
                },
              },
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
        WorkoutCompletionResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Success message",
            },
            updatedPlan: {
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
                progress: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "date-time",
                  },
                  description: "List of dates when workouts were completed",
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
            personalGoalsExperience: {
              type: "object",
              properties: {
                primaryFitnessGoal: {
                  type: "string",
                },
                currentWeightLbs: {
                  type: "number",
                },
                desiredWeightLbs: {
                  type: "number",
                },
                heightCms: {
                  type: "number",
                },
                currentFitnessLevel: {
                  type: "string",
                },
                ageGroup: {
                  type: "string",
                },
              },
            },
            scheduleAvailability: {
              type: "object",
            },
            equipmentAccess: {
              type: "object",
            },
            dietaryPreferences: {
              type: "object",
            },
            healthConsiderations: {
              type: "object",
            },
            preferencesMotivation: {
              type: "object",
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
