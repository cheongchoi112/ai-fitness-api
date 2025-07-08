import express from "express";
import {
  echoData,
  generateVertexAiFitnessPlan,
  generateGeminiFitnessPlan,
  markWorkoutComplete,
} from "../controllers/fitnessController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /fitness/echo:
 *   post:
 *     summary: Echo back the received data
 *     tags: [Fitness]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Echoed data
 */
router.post("/echo", echoData);

/**
 * @swagger
 * /fitness/mark-workout:
 *   post:
 *     summary: Mark or unmark a workout as complete for a specific date
 *     tags: [Fitness]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       This endpoint toggles the completion status of a workout for a specific date.
 *       If the date already exists in the progress list, it will be removed (unmarked).
 *       If the date doesn't exist, it will be added (marked as complete).
 *       Note: Only the day part of the date will be considered, time will be set to 00:00:00.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date when the workout was completed (e.g., "2025-06-26T00:00:00.000Z")
 *           example:
 *             date: "2025-06-26T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Workout completion status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutCompletionResponse'
 *       400:
 *         description: Invalid request data (missing or invalid date)
 *       401:
 *         description: Unauthorized - Invalid token
 *       404:
 *         description: Fitness plan not found for the user
 *       500:
 *         description: Server error
 */
router.post("/mark-workout", authMiddleware, markWorkoutComplete);

export default router;
