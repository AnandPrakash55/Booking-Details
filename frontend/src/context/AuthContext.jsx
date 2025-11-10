import { createContext, useContext, useState } from "react";
import { authMe } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const login = (payload) => {
    setUser(payload);
    localStorage.setItem("user", JSON.stringify(payload));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const hydrate = async () => {
    try {
      const { data } = await authMe();
      // keep only role/bus from server; keep token from storage
      const existing = JSON.parse(localStorage.getItem("user")) || {};
      const merged = { ...existing, role: data.user.role, bus_id: data.user.bus_id };
      setUser(merged);
      localStorage.setItem("user", JSON.stringify(merged));
    } catch (_) {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hydrate }}>
      {children}
    </AuthContext.Provider>
  );
};
