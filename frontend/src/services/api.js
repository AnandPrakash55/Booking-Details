import axios from "axios";

// ❗ Base URL MUST come from environment variable
// remove localhost fallback to avoid Netlify calling localhost
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
