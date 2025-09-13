// backend/routes/aiRoutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

// Text AI
router.get("/text", async (req, res) => {
    const { model, q } = req.query;
    try {
        const response = await axios.get(
            `https://gemini-api-flame.vercel.app/${model}?q=${encodeURIComponent(q)}`
        );
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "AI Text request failed" });
    }
});

// Image AI
router.get("/image", async (req, res) => {
    const { prompt } = req.query;
    try {
        const response = await axios.get(
            `https://nsfw.drsudo.workers.dev/?img=${encodeURIComponent(prompt)}`
        );
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "AI Image request failed" });
    }
});

export default router;
