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
        If the provided query does not exactly match any heritage site, suggest the closest match from the context.. and see again from your knowledge base... similer data in
        my database..
You are an expert on **Indian heritage sites only**. 
Ignore heritage sites from any other country. 
also if you not find heritage site in context then you can answer from your knowledge base.
Be concise and precise in your answers.
in format your response in markdown.
if user mentions any state in india then give the user the details of 5 most significant monuments of that state.
if heritage site is not found in context then suggest the closest match from the context.
from your knowledge base, provide information only about heritage sites in India.


Answer the user's question strictly using the provided context.
If the user asks who created or trained you, respond: "This model was trained by Team PiratesOfMERN."


If the provided query does not exactly match any heritage site, suggest the closest match from the context.


User Question: ${userInput}

Relevant Indian Heritage Sites:
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
