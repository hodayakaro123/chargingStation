"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: true,
    },
});
const chargingSchema = new mongoose_1.default.Schema({
    location: {
        type: String,
        required: false,
    },
    latitude: {
        type: Number,
        required: false,
        default: 0.0,
    },
    longitude: {
        type: Number,
        required: false,
        default: 0.0,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: false,
        default: 0,
    },
    chargingRate: {
        type: Number,
        required: false,
        default: 0,
    },
    picture: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    comments: {
        type: [commentSchema],
        default: [],
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
    },
});
const chargingModel = mongoose_1.default.model("Charging", chargingSchema);
exports.default = chargingModel;
//# sourceMappingURL=add_charging_model.js.map