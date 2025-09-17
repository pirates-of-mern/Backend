import { searchHeritage } from "../services/heritageService.js";
import { askGemini } from "../services/geminiService.js";

export const chatWithAI = async (req, res) => {
    const { question } = req.body;

    try {
        // 1. Search relevant heritage sites from DB
        const heritageDocs = await searchHeritage(question);

        // 2. Pass data + user query to Gemini
        const answer = await askGemini(question, heritageDocs);

        res.json({ answer, heritageDocs });
    } catch (err) {
        console.error("Error in chatWithAI:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const chatHealth = (req, res) => {
    res.json({ message: "Chat endpoint is alive. Use POST with {question}." });
};
