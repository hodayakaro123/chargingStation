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
const user_model_1 = __importDefault(require("../models/user_model"));
const mongoose_1 = __importDefault(require("mongoose"));
const addChargingStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { latitude, longitude, price, rating, picture, description, userId, comments } = req.body;
        const newChargingStation = new add_charging_model_1.default({
            latitude,
            longitude,
            price,
            rating,
            picture,
            description,
            userId,
            comments: comments.map((comment) => ({
                text: comment.text,
                userId: comment.userId,
            })),
        });
        yield newChargingStation.save();
        res.status(201).json({ message: "Charging station added successfully", chargingStation: newChargingStation });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add charging station", error });
    }
});
const getChargerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chargerId } = req.params;
        const chargingStation = yield add_charging_model_1.default.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }
        res.status(200).json({ message: "Charger retrieved successfully", chargingStation });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve charger", error });
    }
});
const getChargersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const chargers = yield add_charging_model_1.default.find({ userId });
        if (!chargers) {
            return res.status(404).json({ message: "No charging stations found for this user" });
        }
        res.status(200).json({ chargers });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get charging stations", error });
    }
});
const updateCharger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chargerId } = req.params;
        const updateData = req.body;
        const chargingStation = yield add_charging_model_1.default.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }
        Object.keys(updateData).forEach(key => {
            chargingStation[key] = updateData[key];
        });
        yield chargingStation.save();
        res.status(200).json({ message: "Charging station updated successfully", chargingStation });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update charging station", error });
    }
});
const deleteChargerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chargerId } = req.params;
        yield add_charging_model_1.default.findByIdAndDelete(chargerId);
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete comment", error });
    }
});
const addSelectedChargingStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, chargerId } = req.params;
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const chargingStation = yield add_charging_model_1.default.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }
        const chargerObjectId = new mongoose_1.default.Types.ObjectId(chargerId);
        if (!user.selectedChargingStations.includes(chargerObjectId)) {
            user.selectedChargingStations.push(chargerObjectId);
            yield user.save();
        }
        res.status(200).json({ message: "Charging station added to user's list successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add charging station to user's list", error });
    }
});
exports.default = { addChargingStation, getChargerById, updateCharger, deleteChargerById, addSelectedChargingStation, getChargersByUserId };
//# sourceMappingURL=charger_controller.js.map