"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const add_charging_controller_1 = __importDefault(require("../controllers/add_charging_controller"));
const user_controller_auth_1 = require("../controllers/user_controller_auth");
const router = (0, express_1.Router)();
router.post("/addCharger", user_controller_auth_1.authMiddleware, (req, res) => {
    add_charging_controller_1.default.addChargingStation(req, res);
});
router.post("/addComment/:chargerId", user_controller_auth_1.authMiddleware, (req, res) => {
    add_charging_controller_1.default.addCommentToChargingStation(req, res);
});
exports.default = router;
//# sourceMappingURL=add_charging_route.js.map