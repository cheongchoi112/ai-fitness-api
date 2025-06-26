import {
  createOrUpdateUserProfile,
  formatUserDataForAI,
  saveFitnessPlan,
  getUserWithFitnessPlan,
  deleteUser,
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

    console.log(
      `Checking if user already exists: ${userId}, email: ${userEmail}`
    );

    // Check if user already exists with a fitness plan
    const existingUserData = await getUserWithFitnessPlan(userId);

    if (
      existingUserData &&
      existingUserData.user &&
      existingUserData.fitnessPlan
    ) {
      console.log(`User already onboarded: ${userId}, returning existing data`);
      return res.status(200).json({
        message: "User already onboarded",
        user: existingUserData.user,
        fitnessPlan: existingUserData.fitnessPlan,
      });
    }

    console.log(`Onboarding new user: ${userId}, email: ${userEmail}`);

    // Save user profile to MongoDB
    const savedUser = await createOrUpdateUserProfile(userId, userData);

    // Format user data for Gemini API
    const aiRequestData = formatUserDataForAI(userData.profile); // Generate personalized plan using Gemini
    const generatedPlan = await generateGeminiContent(
      JSON.stringify(aiRequestData)
    );

    // Parse the generated plan
    let parsedPlan;
    try {
      parsedPlan = JSON.parse(generatedPlan);
    } catch (parseError) {
      console.error("Error parsing generated plan:", parseError);
      return res.status(500).json({
        error: "Failed to parse generated fitness plan",
        rawResponse: generatedPlan.substring(0, 500) + "...", // Include partial raw response for debugging
      });
    }

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

    // Get existing user with fitness plan
    const existingUserData = await getUserWithFitnessPlan(userId);

    if (!existingUserData || !existingUserData.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userProfile = existingUserData.user;

    // Additional verification: check if the user email matches the token email
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
    const aiRequestData = formatUserDataForAI(userProfile); // Generate new personalized plan
    const generatedPlan = await generateGeminiContent(
      JSON.stringify(aiRequestData)
    );

    // Parse the generated plan
    let parsedPlan;
    try {
      parsedPlan = JSON.parse(generatedPlan);
    } catch (parseError) {
      console.error("Error parsing generated plan:", parseError);
      return res.status(500).json({
        error: "Failed to parse generated fitness plan",
        rawResponse: generatedPlan.substring(0, 500) + "...", // Include partial raw response for debugging
      });
    }

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

/**
 * Get current user profile with fitness plan
 * @route GET /api/users/profile
 */
export const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid; // Firebase user ID from auth middleware

    console.log(`Getting profile for user: ${userId}`);

    // Get user data with fitness plan
    const userData = await getUserWithFitnessPlan(userId);

    if (!userData || !userData.user) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Return user profile and fitness plan
    res.status(200).json({
      user: userData.user,
      fitnessPlan: userData.fitnessPlan,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ error: "Failed to retrieve user profile" });
  }
};

/**
 * Delete user account and all associated data
 * @route DELETE /api/users/delete
 */
export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.uid; // Firebase user ID from auth middleware
    const userEmail = req.user.email; // Email from Firebase token

    console.log(
      `Attempting to delete user account: ${userId}, email: ${userEmail}`
    );

    // Delete user data from MongoDB (both users and fitnessPlans collections)
    const deleteResult = await deleteUser(userId);

    if (!deleteResult.userFound) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User account data deleted successfully",
      userDeleted: deleteResult.userDeleted,
      planDeleted: deleteResult.planDeleted,
    });

    // Note: This endpoint only deletes the user's data from MongoDB
    // To completely delete the Firebase Authentication account,
    // the client would need to make a separate request to Firebase Authentication API
    // or you would need to implement Firebase Admin SDK functionality to delete the auth account
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ error: "Failed to delete user account" });
  }
};
