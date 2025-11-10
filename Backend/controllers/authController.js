import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });

export const register = async (req, res) => {
  try {
    const { name, email, password, role, bus_id } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "name, email, password, role required" });
    }
    if (!["owner","driver"].includes(role)) {
      return res.status(400).json({ message: "role must be owner or driver" });
    }

    const [existing] = await db.promise().query("SELECT id FROM users WHERE email=?", [email]);
    if (existing.length) return res.status(409).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.promise().query(
      "INSERT INTO users (name, email, password_hash, role, bus_id) VALUES (?,?,?,?,?)",
      [name, email, hash, role, role === "driver" ? (bus_id || null) : null]
    );

    res.json({ message: "User registered", id: result.insertId });
  } catch (e) {
    res.status(500).json({ message: "Register error", error: String(e) });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log(`Login attempt for email: ${email}`);
    
    const [rows] = await db.promise().query("SELECT * FROM users WHERE email=?", [email]);
    const user = rows[0];
    
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`User found: ${user.email}, role: ${user.role}`);
    
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      console.log(`Password mismatch for user: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`Password verified for user: ${email}`);
    
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = sign({ id: user.id, role: user.role, bus_id: user.bus_id || null });
    console.log(`Login successful for user: ${email}`);
    
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, bus_id: user.bus_id }
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ message: "Login error", error: String(e) });
  }
};

export const me = async (req, res) => {
  // req.user is from verifyToken
  res.json({ user: req.user });
};
