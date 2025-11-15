import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authLogin } from "../services/api";
import { FiMail, FiLock, FiEyeOff, FiEye } from "react-icons/fi";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const { data } = await authLogin(form);
      login({
        token: data.token,
        role: data.user.role,
        bus_id: data.user.bus_id,
        email: data.user.email,
        name: data.user.name 
      });

      if (data.user.role === "owner") window.location.href = "/owner";
      else window.location.href = "/driver";
      
    } catch (e) {
      const msg = e.response?.data?.message || "Login failed, check credentials";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500">
      <div className="w-96 bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-center font-bold text-xl mb-6 text-blue-600">
          HELLO SIGN IN
        </h1>

        {error && (
          <div className="mb-4 text-sm bg-red-100 border border-red-300 text-red-700 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
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
          <div className="mb-2 flex items-center border rounded-lg px-3 py-2">
            <FiLock className="text-gray-500 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full outline-none text-sm"
              placeholder="Password"
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

          <div className="text-right mb-4">
            <a className="text-xs text-blue-600 hover:underline cursor-pointer">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-xl font-semibold"
          >
            {loading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?
          <Link
            to="/signup"
            className="text-blue-600 font-semibold ml-1 hover:underline cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
