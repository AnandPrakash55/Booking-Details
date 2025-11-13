import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// attach token automatically
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authLogin = (data) => API.post("/auth/login", data);
export const authMe = () => API.get("/auth/me");

export const getBuses = () => API.get("/buses");
export const addBus = (data) => API.post("/buses", data);

export const addBooking = (data) => API.post(`/bookings`, data);
export const getBookingsByDate = (date) => API.get(`/bookings?date=${date}`);
export const updateBooking = (id, data) => API.put(`/bookings/${id}`, data);
