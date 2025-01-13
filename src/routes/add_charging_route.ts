import { Router } from "express";
import add_charging_controller from "../controllers/add_charging_controller";
import { authMiddleware } from "../controllers/user_controller_auth";

const router = Router();

router.post("/addCharger", authMiddleware, (req, res) => {
    add_charging_controller.addChargingStation(req, res); 
  });
  

router.post("/addComment/:chargerId", authMiddleware, (req, res) => {
    add_charging_controller.addCommentToChargingStation(req, res); 
});

export default router;