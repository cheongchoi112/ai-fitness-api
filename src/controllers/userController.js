import {
  createOrUpdateUserProfile,
  formatUserDataForAI,
  saveFitnessPlan,
} from "../services/userService.js";
import { generateContent as generateGeminiContent } from "../services/aiFitnessServiceGemini.js";

/**
 * Process user onboarding and generate personalized fitness plan
 * @route POST /api/users/onboarding
 */
export const onboardUser = async (req, res) => {
  try {
    const userId = req.user.uid; // Firebase user ID from auth middleware
    const userEmail = req.user.email; // Email from Firebase token
    const userData = req.body;

    // Basic validation
    if (!userData || !userData.userInfo || !userData.profile) {
      return res
        .status(400)
        .json({ error: "User info and profile data are required" });
    }
    if (!userData.userInfo.email) {
      return res.status(400).json({ error: "Email is required in userInfo" });
    }
    // Verify email matches the one in the token for security
    if (userData.userInfo.email !== userEmail) {
      console.warn(
        `Email mismatch during onboarding: provided ${userData.userInfo.email}, token has ${userEmail}`
      );
      return res
        .status(400)
        .json({ error: "Email in request does not match authenticated user" });
    }

    console.log(`Onboarding user: ${userId}, email: ${userEmail}`);

    // Save user profile to MongoDB
    const savedUser = await createOrUpdateUserProfile(userId, userData);

    // Format user data for Gemini API
    const aiRequestData = formatUserDataForAI(userData.profile);

    // Generate personalized plan using Gemini
    const generatedPlan = await generateGeminiContent(
      JSON.stringify(aiRequestData)
    );

    // Parse the generated plan
    const parsedPlan = JSON.parse(generatedPlan);

    // Save plan to MongoDB
    const savedPlan = await saveFitnessPlan(userId, parsedPlan);

    // Return user profile and fitness plan
    res.status(200).json({
      message: "User onboarded successfully",
      user: savedUser,
      fitnessPlan: savedPlan,
    });
  } catch (error) {
    console.error("Error in user onboarding:", error);
    res.status(500).json({ error: "Failed to complete user onboarding" });
  }
};

/**
 * Regenerate fitness plan for existing user
 * @route POST /api/users/regenerate-plan
 */
export const regeneratePlan = async (req, res) => {
  try {
    const userId = req.user.uid;
    const userEmail = req.user.email; // Email from Firebase token

    // Get existing user profile
    const userProfile = await findUserById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: "User not found" });
    } // Additional verification: check if the user email matches the token email
    if (
      userProfile.userInfo &&
      userProfile.userInfo.email &&
      userProfile.userInfo.email !== userEmail
    ) {
      console.warn(
        `Email mismatch: ${userProfile.userInfo.email} vs ${userEmail}`
      );
      // Still proceed with the request since userId is already verified
    } // Format user data for Gemini API
    const aiRequestData = formatUserDataForAI(userProfile);

    // Generate new personalized plan
    const generatedPlan = await generateGeminiContent(
      JSON.stringify(aiRequestData)
    );

    // Parse the generated plan
    const parsedPlan = JSON.parse(generatedPlan);

    // Save or update plan in MongoDB
    const savedPlan = await saveFitnessPlan(userId, parsedPlan);

    res.status(200).json({
      message: "Fitness plan regenerated successfully",
      fitnessPlan: savedPlan,
    });
  } catch (error) {
    console.error("Error regenerating fitness plan:", error);
    res.status(500).json({ error: "Failed to regenerate fitness plan" });
  }
};
