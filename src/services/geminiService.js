import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(userInput, contextDocs) {
    if (!userInput) return "No question provided.";

    const contextText = contextDocs.map(doc => `
🏛️ ${doc.name} (${doc.location.city}, ${doc.location.state})
Built by: ${doc.build_by || "Unknown"},
 Year: ${doc.build_year || "Unknown"}
Entry Fee: Indians ₹${doc.extra_info?.entry_fee?.indian || 0},
Foreigners ₹${doc.extra_info?.entry_fee?.foreigner || 0}
Timings: ${doc.extra_info?.timings || "N/A"}, Closed on: ${doc.extra_info?.closed_on || "N/A"}
Visitors/year: ${doc.extra_info?.visitors_per_year || "Unknown"}
Description: ${doc.description || "No description available"}
Tags: ${doc.tags?.join(", ") || "None"}
`).join("\n\n");

    try {
        const prompt = `
You are an expert storyteller and historian specializing in Indian heritage.

You have access to real historical data about Indian monuments, provided below as context from a trusted database. You also have the creative ability to turn these facts into compelling stories.

---

🧾 Instructions:
- If the user's query is a story prompt (e.g., "Make a story...", "Tell a tale about..."), generate a **vivid and engaging story** set in India using the **real facts** below.
- Weave historical facts from the context directly into the story wherever possible (monument names, cities, timelines, cultural facts, tags).
- If the monument is not found in the context, suggest the **closest matching** site from the database and use your own historical knowledge to fill in the gaps.
- If the user mentions an Indian state, share a **story involving 5 famous monuments** from that state.
- If the query is informational (not a story), reply with **concise historical facts** from context and your internal knowledge.
- Do not mention heritage sites from other countries.
- Format the entire response in markdown.
- If asked who created or trained you, reply: **"This model was trained by Team PiratesOfMERN."**

---

🧍‍♂️ User Question:
${userInput}

---

📚 Indian Heritage Site Data:
${contextText}
`;


        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ]
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || "No response from Gemini.";
    } catch (err) {
        console.error("Heritage Ass err:", err);
        return "Error generating response from LLM.";
    }
}
