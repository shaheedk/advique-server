import { getGeminiResponse } from "../services/geminiService.js";

export const chatWithGemini = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const reply = await getGeminiResponse(message);
    res.json({ reply });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Something went wrong while contacting Gemini." });
  }
};
