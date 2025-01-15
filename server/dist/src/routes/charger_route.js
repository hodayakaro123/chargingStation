"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const charger_controller_1 = __importDefault(require("../controllers/charger_controller"));
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
 *       example:
 *         text: Great charging station!
 *     ChargingStation:
 *       type: object
 *       required:
 *         - price
 *         - rating
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the charging station
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
 *         userId:
 *           type: string
 *           description: The ID of the user who added the charging station
 *       example:
 *         _id: 67861a6f42063748092fa966
 *         latitude: 41.1234
 *         longitude: -75.1234
 *         price: 15
 *         rating: 4.8
 *         picture: http://example.com/newpicture.jpg
 *         description: Updated charging station description
 *         comments:
 *           - text: Great location and service
 *           - text: Clean and well-maintained
 *         userId: 67861a6f42063748092fa962
 */
/**
 * @swagger
 * /addChargingStation/addCharger:
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
 *               userId:
 *                 type: string
 *                 description: The ID of the user adding the charging station
 *             example:
 *               latitude: 41.1234
 *               longitude: -75.1234
 *               price: 15
 *               rating: 4.8
 *               picture: http://example.com/newpicture.jpg
 *               description: Updated charging station description
 *               comments:
 *                 - text: Great location and service
 *                 - text: Clean and well-maintained
 *               userId: 67861a6f42063748092fa962
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
    charger_controller_1.default.addChargingStation(req, res);
});
/**
 * @swagger
 * /addChargingStation/getChargerById/{chargerId}:
 *   get:
 *     summary: Get a charging station by ID
 *     description: Retrieve details of a charging station using its unique ID.
 *     tags:
 *       - Charging Stations
 *     parameters:
 *       - in: path
 *         name: chargerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the charging station
 *     responses:
 *       200:
 *         description: Charging station retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChargingStation'
 *       404:
 *         description: Charging station not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Charging station not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve charging station
 */
router.get("/getChargerById/:chargerId", (req, res) => {
    charger_controller_1.default.getChargerById(req, res);
});
/**
 * @swagger
 * /addChargingStation/getChargersByUserId/chargers/{userId}:
 *   get:
 *     summary: Get all charging stations by user ID
 *     description: Retrieve a list of all charging stations that belong to a specific user based on their user ID.
 *     tags:
 *       - Charging Stations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to filter charging stations by
 *     responses:
 *       200:
 *         description: List of charging stations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ChargingStation'
 *       404:
 *         description: No charging stations found for the given user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No charging stations found for this user
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve charging stations
 */
router.get("/getChargersByUserId/chargers/:userId", user_controller_auth_1.authMiddleware, (req, res) => {
    charger_controller_1.default.getChargersByUserId(req, res);
});
/**
 * @swagger
 * /addChargingStation/updateCharger/{chargerId}:
 *   put:
 *     summary: Update charging station details
 *     description: Update the details of a specific charging station based on its ID.
 *     tags:
 *       - Charging Stations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chargerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the charging station to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChargingStation'
 *     responses:
 *       200:
 *         description: Charging station updated successfully
 *       404:
 *         description: Charging station not found
 *       500:
 *         description: Server error
 */
router.put("/updateCharger/:chargerId", user_controller_auth_1.authMiddleware, (req, res) => {
    charger_controller_1.default.updateCharger(req, res);
});
/**
 * @swagger
 * /addChargingStation/deleteChargerById/{chargerId}:
 *   delete:
 *     summary: Delete a charging station by ID
 *     description: Deletes a specific charging station based on the provided charger ID.
 *     tags:
 *       - Charging Stations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chargerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the charging station to delete
 *     responses:
 *       200:
 *         description: Charging station deleted successfully
 *       404:
 *         description: Charging station not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteChargerById/:chargerId/", user_controller_auth_1.authMiddleware, (req, res) => {
    charger_controller_1.default.deleteChargerById(req, res);
});
/**
 * @swagger
 * /addChargingStation/addSelectedChargingStation/{userId}/{chargerId}:
 *   post:
 *     summary: Add a selected charging station to user's list
 *     description: Adds a charging station to a user's selected charging stations list based on the user ID and charger ID.
 *     tags:
 *       - Charging Stations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user to which the charging station will be added
 *       - in: path
 *         name: chargerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the charging station to add
 *     responses:
 *       200:
 *         description: Charging station added to the user's list successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Charging station added to user's list successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User or charging station not found
 *       500:
 *         description: Server error
 */
router.post("/addSelectedChargingStation/:userId/:chargerId", user_controller_auth_1.authMiddleware, (req, res) => {
    charger_controller_1.default.addSelectedChargingStation(req, res);
});
exports.default = router;
//# sourceMappingURL=charger_route.js.map