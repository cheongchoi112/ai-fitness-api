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
        User: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "User email address",
            },
            password: {
              type: "string",
              description: "User password",
            },
            name: {
              type: "string",
              description: "User full name",
            },
          },
          required: ["email", "password"],
        },
        FitnessRequest: {
          type: "object",
          description: "Fitness plan request data",
        },
        FitnessResponse: {
          type: "object",
          description: "Generated fitness plan",
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
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
