import axios from "axios";

// Base URL from environment variable (for production)
// Falls back to localhost for local development
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://booking-details-sz6s.onrender.com",
});

// Attach token automatically for every request
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------- AUTH -------------------
export const authSignup = (data) => API.post("/auth/signup", data);
export const authLogin = (data) => API.post("/auth/login", data);
export const authMe = () => API.get("/auth/me");

// ----------------- BUSES ------------------
export const getBuses = () => API.get("/buses");
export const addBus = (data) => API.post("/buses", data);

// ---------------- BOOKINGS ----------------
export const addBooking = (data) => API.post("/bookings", data);
export const getBookingsByDate = (date) =>
  API.get(`/bookings?date=${date}`);
export const updateBooking = (id, data) =>
  API.put(`/bookings/${id}`, data);

export default API;
