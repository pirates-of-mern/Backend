import express from "express";
import { promoteToAdmin, demoteFromAdmin, setPermissions, getAllUsers } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/auth.js";
import { ownerMiddleware } from "../middleware/roles.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Admin access required
 */
router.get("/users", authMiddleware, getAllUsers);

/**
 * @swagger
 * /admin/{id}/promote:
 *   post:
 *     summary: Promote a user to admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User promoted
 *       403:
 *         description: Owner access required
 */
router.post("/:id/promote", authMiddleware, ownerMiddleware, promoteToAdmin);

/**
 * @swagger
 * /admin/{id}/demote:
 *   post:
 *     summary: Demote an admin to user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User demoted
 *       403:
 *         description: Owner access required
 */
router.post("/:id/demote", authMiddleware, ownerMiddleware, demoteFromAdmin);

/**
 * @swagger
 * /admin/{id}/permissions:
 *   post:
 *     summary: Set permissions for a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["manage_users", "manage_heritages"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Permissions updated
 *       403:
 *         description: Owner access required
 */
router.post("/:id/permissions", authMiddleware, ownerMiddleware, setPermissions);

export default router;
