import express from "express";
import generateCarInfo from "../services/geminiService";

const router = express.Router();



router.post("/generate-content", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }
  
  try {
    const result = await generateCarInfo(text);
    console.log(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate content", error });
  }
});

export default router;
