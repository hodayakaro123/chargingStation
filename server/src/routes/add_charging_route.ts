import { Router } from "express";
import add_charging_controller from "../controllers/add_charging_controller";
import { authMiddleware } from "../controllers/user_controller_auth";

const router = Router();

router.post("/addCharger", authMiddleware, (req, res) => {
    add_charging_controller.addChargingStation(req, res); 
});
  

router.get("/getChargerById/:chargerId", (req, res) => {
    add_charging_controller.getChargerById(req, res);
});

router.get("/getChargersByUserId/chargers/:userId", authMiddleware, (req, res) => {
    add_charging_controller.getChargersByUserId(req, res);
});

router.put("/updateCharger/:chargerId", authMiddleware, (req, res) => {
    add_charging_controller.updateCharger(req, res);
});

router.delete("/deleteChargerById/:chargerId/", authMiddleware, (req, res) => {
    add_charging_controller.deleteChargerById(req, res);
});

router.post("/addSelectedChargingStation/:userId/:chargerId", authMiddleware, (req, res) => {
    add_charging_controller.addSelectedChargingStation(req, res);
});
export default router;