import express from "express";
import { 
    registerUser,
     loginUser,
      addPoints,
       leaderboard,
        verifyEmail,
            forgotPassword,
                resetPassword
    } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/:id/points", authMiddleware, adminMiddleware, addPoints);
router.get("/leaderboard", leaderboard);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);




export default router;
