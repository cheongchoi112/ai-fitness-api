import { generateContent as generateVertexContent } from "../services/aiFitnessServiceVertexAi.js";
import { generateContent as generateGeminiContent } from "../services/aiFitnessServiceGemini.js";

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
