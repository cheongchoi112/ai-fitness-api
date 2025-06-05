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
 * /fitness/vertexai:
 *   post:
 *     summary: Generate fitness plan using Vertex AI
 *     tags: [Fitness]
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
router.post("/vertexai", generateVertexAiFitnessPlan);

/**
 * @swagger
 * /fitness/gemini:
 *   post:
 *     summary: Generate fitness plan using Gemini
 *     tags: [Fitness]
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
router.post("/gemini", generateGeminiFitnessPlan);

export default router;
