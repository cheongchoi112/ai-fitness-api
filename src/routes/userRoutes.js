import express from "express";
import {
  onboardUser,
  regeneratePlan,
  getCurrentUserProfile,
  deleteUserAccount,
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
 *               fitnessGoals: ["Build muscle"]
 *               currentWeight: "200"
 *               desiredWeight: "180"
 *               height: "74"
 *               fitnessLevel: "Intermediate"
 *               ageGroup: "25-34"
 *               workoutDaysPerWeek: 4
 *               preferredWorkoutTime: "Midday"
 *               availableEquipment: ["Dumbbells"]
 *               dietaryPreferences: ["No preference"]
 *               dietaryRestrictions: []
 *               otherRestrictions: ""
 *               healthConsiderations: ""
 *               enjoyedWorkouts: ["HIIT", "Strength Training"]
 *               workoutsToAvoid: []
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
 *         content:
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

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete user account and all associated data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       This endpoint deletes the user's data from both the users and fitnessPlans collections in MongoDB.
 *       The user is identified by the Firebase token in the Authorization header.
 *       Note: This only deletes data from MongoDB and not the Firebase Authentication account itself.
 *     responses:
 *       200:
 *         description: User data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User account data deleted successfully
 *                 userDeleted:
 *                   type: boolean
 *                   description: Whether user data was deleted from users collection
 *                 planDeleted:
 *                   type: boolean
 *                   description: Whether user data was deleted from fitnessPlans collection
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/delete", authMiddleware, deleteUserAccount);

export default router;
