import express from "express";
import generateCarInfo from "../services/geminiService";


const router = express.Router();


router.post("/generate-content", async (req, res) => {
  const { carBrand, carYear, carModel, userId } = req.body;

  if (!carBrand || !carYear || !carModel || !userId) {
    return res.status(400).json({ error: "All car details (carBrand, carYear, carModel, userId) are required" });
  }

  try {
    const carInfoText = `Car Brand: ${carBrand}, Car Year: ${carYear}, Car Model: ${carModel}`;
    
    const result = await generateCarInfo(carInfoText, userId, carBrand, carModel, carYear);

    console.log(result); 

    res.json(result); 
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ message: "Failed to generate content", error });
  }
});



export default router;
