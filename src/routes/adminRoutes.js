import express from "express";
import { promoteToAdmin, demoteFromAdmin, setPermissions,getAllUsers } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/auth.js";
import { ownerMiddleware } from "../middleware/roles.js";

const router = express.Router();

router.get("/users", authMiddleware, getAllUsers);
router.post("/:id/promote", authMiddleware, ownerMiddleware, promoteToAdmin);
router.post("/:id/demote", authMiddleware, ownerMiddleware, demoteFromAdmin);
router.post("/:id/permissions", authMiddleware, ownerMiddleware, setPermissions);

export default router;
