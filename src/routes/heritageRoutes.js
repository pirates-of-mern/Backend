import express from "express";
import {
    getHeritages,
    getHeritageById,
    addHeritage,
    updateHeritage,
    deleteHeritage,
} from "../controllers/heritageController.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/roles.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Heritage
 *   description: Heritage site management
 */

/**
 * @swagger
 * /heritages:
 *   get:
 *     summary: Get all heritage sites
 *     tags: [Heritage]
 *     responses:
 *       200:
 *         description: List of heritage sites
 */
router.get("/", getHeritages);

/**
 * @swagger
 * /heritages/{id}:
 *   get:
 *     summary: Get heritage site by ID
 *     tags: [Heritage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Heritage ID
 *     responses:
 *       200:
 *         description: Heritage site details
 *       404:
 *         description: Heritage not found
 */
router.get("/:id", getHeritageById);

/**
 * @swagger
 * /heritages:
 *   post:
 *     summary: Add a new heritage site
 *     tags: [Heritage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *               build_year:
 *                 type: number
 *               build_by:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: ["Heritage","Monument","Temple","Cave","Fort","Religious","Palace","Museum","Other"]
 *               heritage_type:
 *                 type: string
 *                 enum: ["Cultural","Natural","Mixed"]
 *               unesco_status:
 *                 type: boolean
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               extra_info:
 *                 type: object
 *                 properties:
 *                   visitors_per_year:
 *                     type: number
 *                   entry_fee:
 *                     type: object
 *                     properties:
 *                       indian:
 *                         type: number
 *                       foreigner:
 *                         type: number
 *                   timings:
 *                     type: string
 *                   closed_on:
 *                     type: string
 *     responses:
 *       200:
 *         description: Heritage added successfully
 */
router.post("/", addHeritage);

/**
 * @swagger
 * /heritages/{id}:
 *   patch:
 *     summary: Update a heritage site (Admin only)
 *     tags: [Heritage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Heritage ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Heritage updated
 *       403:
 *         description: Admin access required
 */
router.patch("/:id", adminMiddleware, updateHeritage);

/**
 * @swagger
 * /heritages/{id}:
 *   delete:
 *     summary: Delete a heritage site (Admin only)
 *     tags: [Heritage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Heritage ID
 *     responses:
 *       200:
 *         description: Heritage deleted
 *       403:
 *         description: Admin access required
 */
router.delete("/:id", authMiddleware, adminMiddleware, deleteHeritage);

export default router;
