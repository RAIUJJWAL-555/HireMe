import { Router } from "express";
import { auth } from "../middleware";
import { getStats } from "../controllers/dashboardController";

const router = Router();

router.get("/", auth, getStats);

export default router;
