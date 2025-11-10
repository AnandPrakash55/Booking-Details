import { db } from "../config/db.js";

export const addBus = async (req, res) => {
  if (req.user.role !== "owner") return res.status(403).json({ message: "Only owner can add buses" });
  const { bus_number, route_from, route_to, total_seats, driver_name } = req.body;
  try {
    await db.promise().query(
      `INSERT INTO buses (bus_number, route_from, route_to, total_seats, driver_name) VALUES (?,?,?,?,?)`,
      [bus_number, route_from, route_to, total_seats, driver_name]
    );
    res.json({ message: "Bus added successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Add bus failed", error: String(e) });
  }
};

export const getBuses = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM buses");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Fetch buses failed", error: String(e) });
  }
};

