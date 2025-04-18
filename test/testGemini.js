import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const runTest = async () => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  try {
    const result = await model.generateContent("Hello AI!");
    const reply = result.response.text();
    console.log("Response:", reply);
  } catch (err) {
    console.error("Gemini Error:", err);
  }
};

runTest();
