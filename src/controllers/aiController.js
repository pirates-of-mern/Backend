// backend/controllers/aiController.js
import axios from "axios";

export const queryTextController = async (req, res) => {
    try {
        const { model, q } = req.query;
        const response = await axios.get(`https://gemini-api-flame.vercel.app/${model}?q=${encodeURIComponent(q)}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch text AI" });
    }
};

export const generateImageController = async (req, res) => {
    try {
        const { prompt } = req.query;
        const response = await axios.get(`https://nsfw.drsudo.workers.dev/?img=${encodeURIComponent(prompt)}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed to generate image" });
    }
};
