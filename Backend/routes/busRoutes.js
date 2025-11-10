import express from "express";
import { addBus, getBuses } from "../controllers/busController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, requireRole("owner"), addBus);
router.get("/", verifyToken, getBuses);

export default router;
