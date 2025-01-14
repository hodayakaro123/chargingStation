"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const add_charging_controller_1 = __importDefault(require("../controllers/add_charging_controller"));
const user_controller_auth_1 = require("../controllers/user_controller_auth");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Charging Stations
 *   description: The Charging Stations API
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           description: Comment text
 *         userId:
 *           type: string
 *           description: The ID of the user who made the comment
 *       example:
 *         text: Great charging station!
 *         userId: 60d0fe4f5311236168a109ca
 *     ChargingStation:
 *       type: object
 *       required:
 *         - price
 *         - rating
 *       properties:
 *         latitude:
 *           type: number
 *           description: The latitude of the charging station
 *         longitude:
 *           type: number
 *           description: The longitude of the charging station
 *         price:
 *           type: number
 *           description: Price for using the charging station
 *         rating:
 *           type: number
 *           description: Rating of the charging station
 *         picture:
 *           type: string
 *           description: Picture URL of the charging station
 *         description:
 *           type: string
 *           description: Description of the charging station
 *         comments:
 *           type: array
 *           description: List of comments for the charging station
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *       example:
 *         latitude: 34.052235
 *         longitude: -118.243683
 *         price: 10
 *         rating: 4.5
 *         picture: https://example.com/picture.jpg
 *         description: Convenient location near downtown
 *         comments:
 *           - text: Excellent service
 *             userId: 60d0fe4f5311236168a109ca
 */
/**
 * @swagger
 * /api/addChargingStation/addCharger:
 *   post:
 *     summary: Add a new charging station
 *     description: Add a new charging station with details. The `userId` is automatically associated with the authenticated user.
 *     tags:
 *       - Charging Stations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 description: The latitude of the charging station
 *               longitude:
 *                 type: number
 *                 description: The longitude of the charging station
 *               price:
 *                 type: number
 *                 description: Price for using the charging station
 *               rating:
 *                 type: number
 *                 description: Rating of the charging station
 *               picture:
 *                 type: string
 *                 description: Picture URL of the charging station
 *               description:
 *                 type: string
 *                 description: Description of the charging station
 *               comments:
 *                 type: array
 *                 description: List of comments to add with the charging station
 *                 items:
 *                   $ref: '#/components/schemas/Comment'
 *             example:
 *               latitude: 34.052235
 *               longitude: -118.243683
 *               price: 10
 *               rating: 4.5
 *               picture: https://example.com/picture.jpg
 *               description: Convenient location near downtown
 *               comments:
 *                 - text: Excellent service
 *                   userId: 60d0fe4f5311236168a109ca
 *     responses:
 *       201:
 *         description: Charging station created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 chargingStation:
 *                   $ref: '#/components/schemas/ChargingStation'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/addCharger", user_controller_auth_1.authMiddleware, (req, res) => {
    add_charging_controller_1.default.addChargingStation(req, res);
});
router.get("/getChargerById/:chargerId", (req, res) => {
    add_charging_controller_1.default.getChargerById(req, res);
});
router.get("/getChargersByUserId/chargers/:userId", user_controller_auth_1.authMiddleware, (req, res) => {
    add_charging_controller_1.default.getChargersByUserId(req, res);
});
router.put("/updateCharger/:chargerId", user_controller_auth_1.authMiddleware, (req, res) => {
    add_charging_controller_1.default.updateCharger(req, res);
});
router.delete("/deleteChargerById/:chargerId/", user_controller_auth_1.authMiddleware, (req, res) => {
    add_charging_controller_1.default.deleteChargerById(req, res);
});
router.post("/addSelectedChargingStation/:userId/:chargerId", user_controller_auth_1.authMiddleware, (req, res) => {
    add_charging_controller_1.default.addSelectedChargingStation(req, res);
});
exports.default = router;
//# sourceMappingURL=add_charging_route.js.map