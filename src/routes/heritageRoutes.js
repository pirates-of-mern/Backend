import express from "express";
import {
    getHeritages,
    getHeritageById,
    addHeritage,
    updateHeritage,
    deleteHeritage,
} from "../controllers/heritageController.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = express.Router();

router.get("/", getHeritages);
router.get("/:id", getHeritageById);
router.post("/", authMiddleware, adminMiddleware, addHeritage);
router.patch("/:id", authMiddleware, adminMiddleware, updateHeritage);
router.delete("/:id", authMiddleware, adminMiddleware, deleteHeritage);

export default router;
