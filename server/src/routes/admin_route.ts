import { Router } from "express";
import add_charging_controller from "../controllers/charger_controller";
import userControllerAuth from "../controllers/user_controller_auth";
import { authMiddleware } from "../controllers/user_controller_auth";

const router = Router();


router.get("/getAllUsers", authMiddleware, userControllerAuth.getAllUsers);

router.get("getUserById/:id", authMiddleware, userControllerAuth.getUserById);

router.delete("/deleteUser:id", authMiddleware, userControllerAuth.deleteUser);

router.put("/updateUser/:id", authMiddleware, userControllerAuth.updateUser);

router.get("/getAllChargers", (req, res) => {
    add_charging_controller.getAllChargers(req, res);
});

router.get("/getChargersByUserId/chargers/:userId", authMiddleware, (req, res) => {
    add_charging_controller.getChargersByUserId(req, res);
});

router.delete("/deleteChargerById/:chargerId/", authMiddleware, (req, res) => {
    add_charging_controller.deleteChargerById(req, res);
});




export default router;