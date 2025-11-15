import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OwnerDashboard from "./pages/OwnerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import AddBus from "./pages/AddBus";
import AddBooking from "./pages/AddBooking";
import ViewBookings from "./pages/ViewBookings";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/owner" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/add-bus" element={<ProtectedRoute role="owner"><AddBus /></ProtectedRoute>} />
          <Route path="/add-booking" element={<ProtectedRoute role="owner"><AddBooking /></ProtectedRoute>} />
          <Route path="/view-bookings" element={<ProtectedRoute role="owner"><ViewBookings /></ProtectedRoute>} />

          <Route path="/driver" element={<ProtectedRoute role="driver"><DriverDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

