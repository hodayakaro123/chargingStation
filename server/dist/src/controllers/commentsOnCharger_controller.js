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
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chargerId } = req.params;
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Comment text is required" });
        }
        const chargingStation = yield add_charging_model_1.default.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ error: "Charging station not found" });
        }
        chargingStation.comments.push({ text });
        yield chargingStation.save();
        res.status(201).json({
            message: "Comment added successfully",
            chargingStation,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to add charging station", error });
    }
});
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chargerId, commentId } = req.params;
        const chargingStation = yield add_charging_model_1.default.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }
        const comment = chargingStation.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        res.status(200).json({ message: "Comment retrieved successfully", comment });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve comment", error });
    }
});
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("addComment");
    try {
        const { chargerId, commentId } = req.params;
        const { text } = req.body;
        const chargingStation = yield add_charging_model_1.default.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }
        const comment = chargingStation.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.text = text;
        yield chargingStation.save();
        res.status(200).json({ message: "Comment updated successfully", chargingStation });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update comment", error });
    }
});
const deleteCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chargerId, commentId } = req.params;
        const chargingStation = yield add_charging_model_1.default.findById(chargerId);
        if (!chargingStation) {
            return res.status(404).json({ message: "Charging station not found" });
        }
        const comment = chargingStation.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.deleteOne();
        yield chargingStation.save();
        res.status(200).json({ message: "Comment deleted successfully", chargingStation });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete comment", error });
    }
});
exports.default = { addComment, updateComment, deleteCommentById, getCommentById };
//# sourceMappingURL=commentsOnCharger_controller.js.map