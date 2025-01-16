"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const add_comments_controller_1 = __importDefault(require("../controllers/add_comments_controller"));
const user_controller_auth_1 = require("../controllers/user_controller_auth");
const router = (0, express_1.Router)();
router.post("/addComment/:chargerId", user_controller_auth_1.authMiddleware, (req, res) => {
    add_comments_controller_1.default.addComment(req, res);
});
exports.default = router;
//# sourceMappingURL=add_comments.js.map