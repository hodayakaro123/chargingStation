"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_charging_model_1 = __importDefault(require("../models/add_charging_model"));
const addChargingStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("addChargingStation");
    try {
        const { latitude, longitude, price, rating, picture, description, comments } = req.body;
        const newChargingStation = new add_charging_model_1.default({
            latitude,
            longitude,
            price,
            rating,
            picture,
            description,
            comments,
        });
        yield newChargingStation.save();
        res.status(201).json(newChargingStation);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
const addCommentToChargingStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chargerId } = req.params;
        const { comment } = req.body;
        const sender = "req.user?._id; ";
        if (!chargerId || !comment) {
            return res.status(400).json({ error: "Missing charger ID or comment" });
        }
        const chargingStation = yield add_charging_model_1.default.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ error: "Charging station not found" });
        }
        //   chargingStation.comments.push({ sender, comment });
        yield chargingStation.save();
        const updatedChargingStation = yield add_charging_model_1.default.findById(chargerId).populate("comments.sender");
        res.status(200).json(updatedChargingStation);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.default = { addChargingStation, addCommentToChargingStation };
//# sourceMappingURL=add_charging_controller.js.map