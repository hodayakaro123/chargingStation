import { Router } from "express";
import book_a_charger_controller from "../controllers/book_a_charger_controller";
import { authMiddleware } from "../controllers/user_controller_auth";

const router = Router();


router.post("/bookCharger", authMiddleware, book_a_charger_controller.bookCharger);

export default router;