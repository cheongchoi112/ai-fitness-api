import express from "express";
import fitnessRoutes from "./routes/fitnessRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

// Middleware
app.use(express.json());

// Basic route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the AI Fitness API!");
});

// Routes
app.use("/api/fitness", fitnessRoutes);
app.use("/api/users", userRoutes);

// Setup Swagger documentation
setupSwagger(app);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({ error: "Something went wrong!" });
});

export default app; // Export the configured Express app
