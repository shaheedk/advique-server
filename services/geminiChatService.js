
import fs from "fs";
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";

  import mime from "mime-types";
  
  const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyC0UNRF4IM894ZRThV5tGFgPBpBHCasSEE"; // Prefer .env
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro-preview-03-25",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseModalities: [],
    responseMimeType: "text/plain",
  };
  
  export const generateContent = async (req, res) => {
    try {
      const { input } = req.body;
      if (!input) {
        return res.status(400).json({ success: false, error: "Input is required" });
      }
  
      const chatSession = model.startChat({
        generationConfig,
        history: [], // Could extend to include user-specific history if needed
      });
  
      const result = await chatSession.sendMessage(input);
  
      // Handle inline data (e.g., images or files)
      const candidates = result.response.candidates || [];
      const files = [];
      for (let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
        for (
          let part_index = 0;
          part_index < candidates[candidate_index].content.parts.length;
          part_index++
        ) {
          const part = candidates[candidate_index].content.parts[part_index];
          if (part.inlineData) {
            try {
              const filename = `uploads/output_${req.user.id}_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
              fs.writeFileSync(filename, Buffer.from(part.inlineData.data, "base64"));
              files.push(filename);
            } catch (err) {
              console.error("Error writing file:", err);
              return res.status(500).json({ success: false, error: "Failed to save generated file" });
            }
          }
        }
      }
  
      res.status(200).json({
        success: true,
        text: result.response.text(),
        files,
      });
    } catch (error) {
      console.error("Error in generateContent:", error);
      res.status(500).json({ success: false, error: "Failed to generate content" });
    }
  };