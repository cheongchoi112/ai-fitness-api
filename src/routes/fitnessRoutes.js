import express from "express";
import {
  echoData,
  generateVertexAiFitnessPlan,
  generateGeminiFitnessPlan,
} from "../controllers/fitnessController.js";

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
 * /fitness/generate-plan-gemini:
 *   post:
 *     summary: Generate a personalized fitness plan using Google's Gemini AI
 *     tags: [Fitness]
 *     description: >
 *       This endpoint uses Google's Gemini AI to generate a personalized
 *       fitness plan based on user information and preferences.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfile'
 *     responses:
 *       200:
 *         description: Generated fitness plan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FitnessResponse'
 *       500:
 *         description: Server error
 */
router.post("/generate-plan-gemini", generateGeminiFitnessPlan);

// Mark-workout endpoint has been removed as it's no longer required

export default router;
