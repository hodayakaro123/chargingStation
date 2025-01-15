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
const express_1 = __importDefault(require("express"));
const geminiService_1 = __importDefault(require("../services/geminiService"));
const router = express_1.default.Router();
router.post("/generate-content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }
    try {
        const result = yield (0, geminiService_1.default)(text);
        console.log(result);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to generate content", error });
    }
}));
exports.default = router;
//# sourceMappingURL=gemini_route.js.map