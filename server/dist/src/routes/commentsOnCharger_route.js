"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const add_comments_controller_1 = __importDefault(require("../controllers/add_comments_controller"));
const user_controller_auth_1 = require("../controllers/user_controller_auth");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Charging Stations Comments
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
 *           description: The content of the comment.
 *           example: "Could be a better station!!!!"





 * /addComments/addComment/{chargerId}:
 *   post:
 *     summary: Add a comment to a specific charging station
 *     description: Allows a user to add a comment to a charging station based on its ID.
 *     tags:
 *       - Charging Stations Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chargerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the charging station to which the comment will be added.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment added successfully to the charging station.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment added successfully"
 *                 chargingStation:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67861a6f42063748092fa966"
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input, comment could not be added.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment text is required"
 *       404:
 *         description: Charging station not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Charging station not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to add comment"
 */
router.post("/addComment/:chargerId", user_controller_auth_1.authMiddleware, (req, res) => {
    add_comments_controller_1.default.addComment(req, res);
});
/**
 * @swagger
 * /addComments/getComment/{chargerId}/{commentId}:
 *   get:
 *     summary: Retrieve a specific comment by its ID for a given charging station
 *     description: Fetches the details of a specific comment associated with a charging station using the IDs provided.
 *     tags:
 *       - Charging Stations Comments
 *     parameters:
 *       - in: path
 *         name: chargerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the charging station.
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   description: The content of the comment.
 *                   example: "Great !"
 *                 _id:
 *                   type: string
 *                   description: The unique ID of the comment.
 *                   example: "60d0fe4f531123fs168as09cb"
 *                 chargerId:
 *                   type: string
 *                   description: The ID of the associated charging station.
 *                   example: "67861a6f42063748092fa966"
 *       404:
 *         description: Comment or charging station not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment or charging station not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve comment"
 */
router.get("/getComment/:chargerId/:commentId", (req, res) => {
    add_comments_controller_1.default.getCommentById(req, res);
});
/**
 * @swagger
 * /addComments/updateComment/{chargerId}/{commentId}:
 *   put:
 *     summary: Update a specific comment for a given charging station
 *     description: Updates the text of a specific comment associated with a charging station using the provided IDs.
 *     tags:
 *       - Charging Stations Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chargerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the charging station.
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The new content of the comment.
 *                 example: "Updated comment text!"
 *     responses:
 *       200:
 *         description: Successfully updated the comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment updated successfully"
 *                 updatedComment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the updated comment.
 *                       example: "60d0fe4f531123fs168as09cb"
 *                     text:
 *                       type: string
 *                       description: The updated text of the comment.
 *                       example: "Updated comment text!"
 *                     chargerId:
 *                       type: string
 *                       description: The ID of the associated charging station.
 *                       example: "67861a6f42063748092fa966"
 *       400:
 *         description: Invalid input, comment could not be updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment text is required"
 *       404:
 *         description: Comment or charging station not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment or charging station not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to update comment"
 */
router.put("/updateComment/:chargerId/:commentId", user_controller_auth_1.authMiddleware, (req, res) => {
    add_comments_controller_1.default.updateComment(req, res);
});
/**
 * @swagger
 * /addComments/deleteComment/{chargerId}/{commentId}:
 *   delete:
 *     summary: Delete a specific comment from a charging station
 *     description: Deletes a specific comment associated with a charging station using the provided IDs.
 *     tags:
 *       - Charging Stations Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chargerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the charging station.
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Successfully deleted the comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *                 deletedComment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the deleted comment.
 *                       example: "60d0fe4f531123fs168as09cb"
 *                     text:
 *                       type: string
 *                       description: The text of the deleted comment.
 *                       example: "This is a comment on the post."
 *                     chargerId:
 *                       type: string
 *                       description: The ID of the associated charging station.
 *                       example: "67861a6f42063748092fa966"
 *       404:
 *         description: Comment or charging station not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment or charging station not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to delete comment"
 */
router.delete("/deleteComment/:chargerId/:commentId", user_controller_auth_1.authMiddleware, (req, res) => {
    add_comments_controller_1.default.deleteCommentById(req, res);
});
exports.default = router;
//# sourceMappingURL=commentsOnCharger_route.js.map