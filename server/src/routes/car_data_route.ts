import express from "express";
import carData from "../controllers/car_data_controller";
const router = express.Router();


router.post("/get-car-data", async (req, res) => {
  carData.getCarData(req, res);
});


export default router;
