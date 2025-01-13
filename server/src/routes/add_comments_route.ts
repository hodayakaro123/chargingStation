import { Router } from "express";
import add_comments_controller from "../controllers/add_comments_controller";
import { authMiddleware } from "../controllers/user_controller_auth";

const router = Router();

router.post("/addComment/:chargerId", authMiddleware, (req, res) => {
    add_comments_controller.addComment(req, res); 
});

router.get("/getComment/:chargerId/:commentId", authMiddleware, (req, res) => {
    add_comments_controller.getCommentById(req, res);
});

router.put("/updateComment/:chargerId/:commentId", authMiddleware, (req, res) => {
    add_comments_controller.updateComment(req, res);
});

router.delete("/deleteComment/:chargerId/:commentId", authMiddleware, (req, res) => {
    add_comments_controller.deleteCommentById(req, res);
});



export default router;