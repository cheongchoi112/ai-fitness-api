// To run this code you need to install the following dependencies:
// npm install @google/genai mime

import { GoogleGenAI } from "@google/genai";
import { promptInstruction, responseSchema } from "./constants.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Format user data for AI request
 * @param {Object} userData - User profile data
 * @returns {Object} Formatted data for AI service
 */
export const formatUserDataForAI = (userData) => {
  // Map user profile data to the format expected by Gemini API
  // Extract profile data if it's passed as a full user object
  const profile = userData.profile || userData;

  // Helper function to convert inches to centimeters
  function convertInchesToCm(inches) {
    if (typeof inches === "number") {
      return Math.round(inches * 2.54); // 1 inch = 2.54 cm
    }
    return inches; // Return as is if not a number
  }

  return {
    personal_goals_experience: {
      primary_fitness_goal: Array.isArray(profile.fitnessGoals)
        ? profile.fitnessGoals[0]
        : profile.fitnessGoals,
      current_weight_lbs:
        parseFloat(profile.currentWeight) || profile.currentWeight,
      desired_weight_lbs:
        parseFloat(profile.desiredWeight) || profile.desiredWeight,
      height_inches: parseFloat(profile.height) || profile.height,
      current_fitness_level: profile.fitnessLevel,
      age_group: profile.ageGroup,
    },
    schedule_availability: {
      days_per_week_workout: profile.workoutDaysPerWeek,
      preferred_workout_time: profile.preferredWorkoutTime,
    },
    equipment_access: {
      equipment: profile.availableEquipment || [],
    },
    dietary_preferences: {
      primary_dietary_preference: Array.isArray(profile.dietaryPreferences)
        ? profile.dietaryPreferences[0]
        : profile.dietaryPreferences,
      dietary_restrictions: profile.dietaryRestrictions || [],
      other_restrictions: profile.otherRestrictions || "",
    },
    health_considerations: {
      health_considerations: profile.healthConsiderations || "None",
      workout_types_to_avoid: profile.workoutsToAvoid || [],
    },
    preferences_motivation: {
      enjoyed_workout_types: profile.enjoyedWorkouts || [],
    },
  };
};

/**
 * Generate personalized fitness plan using Gemini AI
 * @param {Object} userData - User profile data (either raw profile or an already formatted object)
 * @returns {Promise<string>} JSON string response from Gemini AI
 */
async function generateContent(userData) {
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
  const model = "gemini-2.5-flash-lite-preview-06-17";

  // Format user data for Gemini API if raw input provided
  let formattedData;
  if (typeof userData === "string") {
    try {
      // If it's already a JSON string, use it directly
      formattedData = userData;
    } catch (e) {
      console.error("Invalid JSON string provided to generateContent:", e);
      throw new Error("Invalid input format");
    }
  } else {
    // Format the user data using our helper function
    formattedData = JSON.stringify(formatUserDataForAI(userData));
  }

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: formattedData,
        },
      ],
    },
  ];

  console.log(`Sending request to Gemini API ${model}...`);
  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = "";
  for await (const chunk of response) {
    if (chunk.text) {
      fullResponse += chunk.text;
    }
  }
  console.log("\nGemini API response complete!");

  return fullResponse;
}

export { generateContent };
