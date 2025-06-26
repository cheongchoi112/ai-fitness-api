import { generateContent as generateVertexContent } from "../services/aiFitnessServiceVertexAi.js";
import { generateContent as generateGeminiContent } from "../services/aiFitnessServiceGemini.js";
import { toggleWorkoutCompletion } from "../services/fitnessService.js";

// Echo endpoint controller
export const echoData = (req, res) => {
  const receivedData = req.body;
  res.json(receivedData);
};

// Generate fitness plan with Vertex AI controller
export const generateVertexAiFitnessPlan = async (req, res) => {
  try {
    const userInput = JSON.stringify(req.body);
    const result = await generateVertexContent(userInput);

    try {
      const jsonResult = JSON.parse(result);
      res.json(jsonResult);
    } catch (parseError) {
      res.send(result);
    }
  } catch (error) {
    console.error("Error generating fitness plan with Vertex AI:", error);
    res.status(500).json({ error: "Failed to generate fitness plan" });
  }
};

// Generate fitness plan with Gemini controller
export const generateGeminiFitnessPlan = async (req, res) => {
  try {
    const userInput = JSON.stringify(req.body);
    const result = await generateGeminiContent(userInput);

    try {
      const jsonResult = JSON.parse(result);
      res.json(jsonResult);
    } catch (parseError) {
      res.send(result);
    }
  } catch (error) {
    console.error("Error generating fitness plan with Gemini:", error);
    res.status(500).json({ error: "Failed to generate fitness plan" });
  }
};

/**
 * Mark workout as complete for a specific date
 * @route POST /api/fitness/mark-workout
 *
 * Note: Only the day part of the date will be considered, time will be set to 00:00:00
 */
export const markWorkoutComplete = async (req, res) => {
  try {
    const userId = req.user.uid; // Firebase user ID from auth middleware
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    // Parse the date string to ensure it's a valid date
    const completionDate = new Date(date);
    if (isNaN(completionDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Toggle workout completion status for this date
    const updatedPlan = await toggleWorkoutCompletion(userId, completionDate);

    res.status(200).json({
      message: "Workout completion status toggled successfully",
      updatedPlan,
    });
  } catch (error) {
    console.error("Error marking workout complete:", error);

    if (error.message === "Fitness plan not found for the user") {
      return res
        .status(404)
        .json({ error: "Fitness plan not found for the user" });
    }

    res
      .status(500)
      .json({ error: "Failed to update workout completion status" });
  }
};
