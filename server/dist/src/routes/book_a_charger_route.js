"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_a_charger_controller_1 = __importDefault(require("../controllers/book_a_charger_controller"));
const user_controller_auth_1 = require("../controllers/user_controller_auth");
const router = (0, express_1.Router)();
router.post("/bookCharger", user_controller_auth_1.authMiddleware, book_a_charger_controller_1.default.bookCharger);
exports.default = router;
//# sourceMappingURL=book_a_charger_route.js.map