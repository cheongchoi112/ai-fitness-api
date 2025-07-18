import express from "express";
import fitnessRoutes from "./routes/fitnessRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

// Middleware
app.use(express.json());

// Add diagnostic request logging middleware
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  console.log(`[Request Headers] ${JSON.stringify(req.headers)}`);
  if (req.params && Object.keys(req.params).length > 0) {
    console.log(`[Request Params] ${JSON.stringify(req.params)}`);
  }
  next();
});

// Basic route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the AI Fitness API!");
});

// Routes
app.use("/api/fitness", fitnessRoutes);
app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);

// Setup Swagger documentation
setupSwagger(app);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  console.error(`[Error Stack] ${err.stack}`); // Log the error stack for debugging
  res.status(500).json({ error: "Something went wrong!" });
});

export default app; // Export the configured Express app
