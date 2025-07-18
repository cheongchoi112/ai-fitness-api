import express from "express";
import {
  addWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkouts,
  addWeight,
  updateWeight,
  deleteWeight,
  getWeights,
  getUserProgress,
} from "../controllers/progressController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /progress:
 *   get:
 *     summary: Get comprehensive progress data with metrics
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Returns combined weight and workout history with calculated metrics.
 *       Includes basic statistics, goal tracking, and frequency metrics.
 *       When both startDate and endDate are specified for weight history,
 *       the response includes interpolated weight values for the start and end dates
 *       based on the closest available data, ensuring the date range boundaries are included.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter entries after this date (ISO format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter entries before this date (ISO format)
 *     responses:
 *       200:
 *         description: Comprehensive progress data with metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weightData:
 *                   type: object
 *                   properties:
 *                     history:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ProgressWeightEntry'
 *                     metrics:
 *                       type: object
 *                 workoutData:
 *                   type: object
 *                   properties:
 *                     history:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ProgressWorkoutEntry'
 *                     metrics:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/", getUserProgress);

/**
 * @swagger
 * /progress/workout:
 *   post:
 *     summary: Add a new workout completion record
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddWorkoutRequest'
 *     responses:
 *       201:
 *         description: Workout entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgressEntryResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/workout", addWorkout);

/**
 * @swagger
 * /progress/workout/{entryId}:
 *   put:
 *     summary: Update an existing workout entry
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workout entry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWorkoutRequest'
 *     responses:
 *       200:
 *         description: Workout entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgressEntryResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout entry not found
 *       500:
 *         description: Server error
 */
router.put("/workout/:entryId", updateWorkout);

/**
 * @swagger
 * /progress/workout/{entryId}:
 *   delete:
 *     summary: Delete a workout entry
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the workout entry to delete
 *     responses:
 *       200:
 *         description: Workout entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Workout entry deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout entry not found
 *       500:
 *         description: Server error
 */
router.delete("/workout/:entryId", deleteWorkout);

/**
 * @swagger
 * /progress/workout-history:
 *   get:
 *     summary: Get user's workout history
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter entries after this date (ISO format e.g., "2025-07-01T00:00:00Z")
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter entries before this date (ISO format e.g., "2025-07-31T23:59:59Z")
 *     responses:
 *       200:
 *         description: List of workout entries
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutHistoryResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/workout-history", getWorkouts);

/**
 * @swagger
 * /progress/weight:
 *   post:
 *     summary: Add a new weight entry
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddWeightRequest'
 *     responses:
 *       201:
 *         description: Weight entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgressEntryResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/weight", addWeight);

/**
 * @swagger
 * /progress/weight/{entryId}:
 *   put:
 *     summary: Update an existing weight entry
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the weight entry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWeightRequest'
 *     responses:
 *       200:
 *         description: Weight entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgressEntryResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Weight entry not found
 *       500:
 *         description: Server error
 */
router.put("/weight/:entryId", updateWeight);

/**
 * @swagger
 * /progress/weight/{entryId}:
 *   delete:
 *     summary: Delete a weight entry
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the weight entry to delete
 *     responses:
 *       200:
 *         description: Weight entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Weight entry deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Weight entry not found
 *       500:
 *         description: Server error
 */
router.delete("/weight/:entryId", deleteWeight);

/**
 * @swagger
 * /progress/weight-history:
 *   get:
 *     summary: Get user's weight history
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Returns the user's weight history with optional date filtering.
 *       When both startDate and endDate are specified, the response includes
 *       interpolated weight values for the start and end dates based on the
 *       closest available data, ensuring the date range boundaries are included.
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter entries after this date (ISO format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter entries before this date (ISO format)
 *     responses:
 *       200:
 *         description: List of weight entries
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeightHistoryResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/weight-history", getWeights);

export default router;
