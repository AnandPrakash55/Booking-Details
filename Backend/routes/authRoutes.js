import express from "express";
import { login, register, me } from "../controllers/authController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register owner/driver (lock down to owner only in production)
router.post("/register", verifyToken, requireRole("owner"), register);

// Public login
router.post("/login", login);

// Get current user info from token
router.get("/me", verifyToken, me);

export default router;
