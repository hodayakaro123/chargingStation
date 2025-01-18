"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const carDataSchema = new mongoose_1.default.Schema({
    brandName: {
        type: String,
        required: true,
    },
    carModel: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    range: {
        type: Number,
        required: true,
    },
    fastChargingSpeed: {
        type: Number,
        required: true,
    },
    homeChargingSpeed: {
        type: Number,
        required: true,
    },
    batteryCapacity: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
});
const carDataModel = mongoose_1.default.model("CarData", carDataSchema);
exports.default = carDataModel;
//# sourceMappingURL=car_data_model.js.map