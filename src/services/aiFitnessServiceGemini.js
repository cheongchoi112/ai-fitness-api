// To run this code you need to install the following dependencies:
// npm install @google/genai mime

import { GoogleGenAI } from "@google/genai";
import { promptInstruction, responseSchema } from "./constants.js";
import dotenv from "dotenv";

dotenv.config();

async function generateContent(userInput = null) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      required: ["weekly_plan", "general_notes"],
      properties: responseSchema,
    },
    systemInstruction: [
      {
        text: promptInstruction,
      },
    ],
  };
  const model = "gemini-2.5-flash-preview-05-20";

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: userInput,
        },
      ],
    },
  ];

  console.log("Sending request to Gemini API...");
  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = "";
  for await (const chunk of response) {
    if (chunk.text) {
      fullResponse += chunk.text;
      process.stdout.write(chunk.text);
    }
  }
  console.log("\nGemini API response complete!");

  return fullResponse;
}

export { generateContent };
