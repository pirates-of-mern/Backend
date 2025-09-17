import express from "express";
import { chatWithAI, chatHealth } from "../utils/apiHelpers.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI chatbot endpoints
 */

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: Send a message to AI chatbot
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hello AI, tell me about Taj Mahal"
 *     responses:
 *       200:
 *         description: Response from AI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: string
 *                   example: "The Taj Mahal is a beautiful monument in Agra..."
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/chat", chatWithAI);

/**
 * @swagger
 * /ai/chat:
 *   get:
 *     summary: Health check for AI service
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI service is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "AI service is healthy"
 */
router.get("/chat", chatHealth);

export default router;
