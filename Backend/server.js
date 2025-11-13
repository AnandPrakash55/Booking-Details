import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// DB + Routes
import "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

// ===================================================
// ✅ CORS CONFIG – ALLOW LOCAL + NETLIFY + RENDER
// ===================================================
const allowedOrigins = [
  "http://localhost:5173",                        // Local frontend (development)
  "https://booking-detail.netlify.app",           // Netlify frontend
  "https://booking-details-z05f.onrender.com"     // Render backend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow API tools like Postman (no origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ BLOCKED BY CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// ===================================================
// 📝 LOGGING MIDDLEWARE
// ===================================================
app.use((req, res, next) => {
  console.log(
    `📌 ${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${
      req.headers.origin
    }`
  );
  next();
});

// ===================================================
// 🏠 ROOT ROUTE
// ===================================================
app.get("/", (req, res) => {
  res.json({
    message: "Bus Booking System API is running 🚀",
    version: "1.0.0",
    frontend: "https://booking-detail.netlify.app",
    backend: "https://booking-details-z05f.onrender.com",
    endpoints: {
      auth: "/api/auth",
      buses: "/api/buses",
      bookings: "/api/bookings",
    },
  });
});

// ===================================================
// 📌 API ROUTES
// ===================================================
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

// ===================================================
// ❌ 404 HANDLER
// ===================================================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// ===================================================
// 🚀 START SERVER
// ===================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}...`)
);
