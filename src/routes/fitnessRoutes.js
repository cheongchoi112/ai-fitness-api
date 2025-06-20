import express from "express";
import {
  echoData,
  generateVertexAiFitnessPlan,
  generateGeminiFitnessPlan,
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
 * /fitness/vertexai:
 *   post:
 *     summary: Generate fitness plan using Vertex AI
 *     tags: [Fitness]
 *     security:
 *       - firebaseAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FitnessRequest'
 *     responses:
 *       200:
 *         description: Generated fitness plan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FitnessResponse'
 *       500:
 *         description: Error generating plan
 */
router.post("/vertexai", authMiddleware, generateVertexAiFitnessPlan);

/**
 * @swagger
 * /fitness/gemini:
 *   post:
 *     summary: Generate fitness plan using Gemini
 *     tags: [Fitness]
 *     security:
 *       - firebaseAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FitnessRequest'
 *     responses:
 *       200:
 *         description: Generated fitness plan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FitnessResponse'
 *       500:
 *         description: Error generating plan
 */
router.post("/gemini", authMiddleware, generateGeminiFitnessPlan);

export default router;
