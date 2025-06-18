import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000; // Get port from .env or default to 3000

// Connect to MongoDB
connectDB();

// Start the Express server
// Use 0.0.0.0 to bind on all network interfaces - required for Cloud Run
app.listen(PORT, "0.0.0.0", () => {
  // More informative log message, especially for Docker environments
  if (process.env.RUNNING_IN_DOCKER) {
    console.log(
      `Server running on port ${PORT} inside container (bound to all interfaces)`
    );
    console.log(
      `Access the API on your host machine at the port you mapped to ${PORT}`
    );
  } else {
    console.log(`Server running on http://localhost:${PORT}`);
  }

  // Log startup success - helpful for Cloud Run logs
  console.log(
    `Express server successfully started and listening on port ${PORT}`
  );
});
