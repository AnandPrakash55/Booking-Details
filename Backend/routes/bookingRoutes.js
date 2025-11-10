import express from "express";
import { addBooking, getBookingsByDate, updateBooking } from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addBooking);          // owner-only check is inside controller
router.get("/", verifyToken, getBookingsByDate);    // drivers auto-filtered by their bus_id
router.put("/:id", verifyToken, updateBooking);     // owner-only check is inside controller

export default router;
