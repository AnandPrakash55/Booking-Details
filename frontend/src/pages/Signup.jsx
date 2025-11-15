import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authSignup } from "../services/api";
import { FiMail, FiLock, FiUser, FiEyeOff, FiEye } from "react-icons/fi";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data } = await authSignup({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // Auto-login after successful signup
      login({
        token: data.token,
        role: data.user.role,
        bus_id: data.user.bus_id,
        email: data.user.email,
        name: data.user.name,
      });

      // Redirect to owner dashboard
      navigate("/owner");
    } catch (e) {
      const msg = e.response?.data?.message || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500">
      <div className="w-96 bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-center font-bold text-xl mb-6 text-blue-600">
          CREATE OWNER ACCOUNT
        </h1>

        {error && (
          <div className="mb-4 text-sm bg-red-100 border border-red-300 text-red-700 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          {/* Name Field */}
          <div className="mb-4 flex items-center border rounded-lg px-3 py-2">
            <FiUser className="text-gray-500 mr-2" />
            <input
              type="text"
              className="w-full outline-none text-sm"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email Field */}
          <div className="mb-4 flex items-center border rounded-lg px-3 py-2">
            <FiMail className="text-gray-500 mr-2" />
            <input
              type="email"
              className="w-full outline-none text-sm"
              placeholder="email@domain.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 flex items-center border rounded-lg px-3 py-2">
            <FiLock className="text-gray-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full outline-none text-sm"
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4 flex items-center border rounded-lg px-3 py-2">
            <FiLock className="text-gray-500 mr-2" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full outline-none text-sm"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer text-gray-500"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "SIGN UP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?
          <Link
            to="/"
            className="text-blue-600 font-semibold ml-1 hover:underline cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

