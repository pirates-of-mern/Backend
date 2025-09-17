import express from "express";
import { registerUser, loginUser } from "../controllers/user/authController.js";
import { addPoints, leaderboard } from "../controllers/user/pointsController.js";
import { forgotPassword, resetPassword } from "../controllers/user/passwordController.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/roles.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and points
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: "John Doe"
 *               email: "john@example.com"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Email already in use
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "john@example.com"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/{id}/points:
 *   post:
 *     summary: Add points to a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               points:
 *                 type: number
 *             example:
 *               points: 100
 *     responses:
 *       200:
 *         description: Points added
 *       403:
 *         description: Admin access required
 */
router.post("/:id/points", authMiddleware, adminMiddleware, addPoints);

/**
 * @swagger
 * /users/leaderboard:
 *   get:
 *     summary: Get user leaderboard
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Leaderboard list
 */
router.get("/leaderboard", leaderboard);

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: "john@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /users/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             example:
 *               password: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset-password/:token", resetPassword);

export default router;
