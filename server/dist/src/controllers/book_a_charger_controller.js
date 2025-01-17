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
const book_a_chrager_model_1 = __importDefault(require("../models/book_a_chrager.model"));
const bookCharger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chargerId, StartTime, EndTime, Date, userId } = req.body;
        const booking = new book_a_chrager_model_1.default({
            chargerId,
            StartTime,
            EndTime,
            Date,
            userId,
        });
        yield booking.save();
        res.status(201).json({ message: "Charger booked successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to book charger", error });
    }
});
exports.default = { bookCharger };
//# sourceMappingURL=book_a_charger_controller.js.map