import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Booking System API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/login": "Login",
        "GET /api/auth/me": "Get current user info"
      },
      buses: {
        "GET /api/buses": "Get all buses",
        "POST /api/buses": "Add bus (owner only)"
      },
      bookings: {
        "GET /api/bookings?date=YYYY-MM-DD": "Get bookings by date",
        "POST /api/bookings": "Add booking (owner only)",
        "PUT /api/bookings/:id": "Update booking (owner only)"
      }
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: "/api/auth, /api/buses, /api/bookings"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
