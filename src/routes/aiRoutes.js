import express from "express";
import { searchHeritage } from "../services/heritageService.js";
import { askGemini } from "../services/geminiService.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
    const { question } = req.body;

    try {
        // 1. Search relevant heritage sites from DB
        const heritageDocs = await searchHeritage(question);

        // 2. Pass data + user query to Gemini
        const answer = await askGemini(question, heritageDocs);

        res.json({ answer, heritageDocs });
    } catch (err) {
        console.error("Error in /chat:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/chat", (req, res) => {
    res.json({ message: "Chat endpoint is alive. Use POST with {question}." });
});


export default router;
