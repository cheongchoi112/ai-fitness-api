import express from "express";
import {
  onboardUser,
  regeneratePlan,
  getCurrentUserProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /users/onboarding:
 *   post:
 *     summary: Process user onboarding with profile and preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       This endpoint accepts user profile data for onboarding. The userInfo object
 *       must contain the email field, but can include any other optional properties.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserOnboarding'
 *           example:
 *             userInfo:
 *               email: "john.doe@example.com"
 *               firstName: "John"
 *               lastName: "Doe"
 *             profile:
 *               personalGoalsExperience:
 *                 primaryFitnessGoal: "Build muscle"
 *                 currentWeightLbs: 180
 *                 desiredWeightLbs: 170
 *                 heightCms: 175
 *                 currentFitnessLevel: "Intermediate"
 *                 ageGroup: "25-34"
 *               scheduleAvailability:
 *                 daysPerWeekWorkout: "3-4"
 *                 preferredWorkoutTimes: "Evening"
 *               equipmentAccess:
 *                 equipment: ["Dumbbells", "Resistance bands"]
 *                 location: "Home"
 *               dietaryPreferences:
 *                 primaryDietaryPreference: "High-protein"
 *                 restrictionsAllergies: ["Gluten-free"]
 *               healthConsiderations:
 *                 medicalConditions: "None"
 *                 workoutsToAvoid: ["High-impact"]
 *               preferencesMotivation:
 *                 enjoyedWorkoutTypes: ["Strength training", "HIIT"]
 *     responses:
 *       200:
 *         description: User onboarded successfully with fitness plan
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Server error
 */
router.post("/onboarding", authMiddleware, onboardUser);

/**
 * @swagger
 * /users/regenerate-plan:
 *   post:
 *     summary: Regenerate fitness plan for existing user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New fitness plan generated successfully
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/regenerate-plan", authMiddleware, regeneratePlan);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile with fitness plan
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       This endpoint retrieves the current user's profile information and associated fitness plan.
 *       The user is identified by the Firebase token in the Authorization header.
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Server error
 */
router.get("/profile", authMiddleware, getCurrentUserProfile);

export default router;
