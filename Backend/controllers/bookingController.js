import { db } from "../config/db.js";

export const addBooking = async (req, res) => {
  if (req.user.role !== "owner") return res.status(403).json({ message: "Only owner can add bookings" });

  const { bus_id, customer_name, phone, amount, journey_date } = req.body;

  try {
    await db.promise().query(
      `INSERT INTO bookings (bus_id, customer_name, phone, amount, journey_date) VALUES (?,?,?,?,?)`,
      [bus_id, customer_name, phone, amount, journey_date]
    );
    res.json({ message: "Booking added!" });
  } catch (e) {
    res.status(500).json({ message: "Add booking failed", error: String(e) });
  }
};

export const getBookingsByDate = async (req, res) => {
  const { date } = req.query;
  const params = [date];
  let sql = `
    SELECT bk.id, bk.bus_id, b.bus_number, bk.customer_name, bk.phone, bk.amount, bk.journey_date
    FROM bookings bk
    JOIN buses b ON bk.bus_id = b.id
    WHERE bk.journey_date = ?
  `;

  // If driver, restrict to their bus_id
  if (req.user.role === "driver") {
    if (!req.user.bus_id) return res.status(400).json({ message: "Driver has no bus assigned" });
    sql += " AND bk.bus_id = ?";
    params.push(req.user.bus_id);
  }

  try {
    const [rows] = await db.promise().query(sql, params);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: "Fetch failed", error: String(e) });
  }
};

export const updateBooking = async (req, res) => {
  if (req.user.role !== "owner") return res.status(403).json({ message: "Only owner can update bookings" });

  const { id } = req.params;
  const { bus_id, customer_name, phone, amount, journey_date } = req.body;

  if (!bus_id || !customer_name || !phone || !amount || !journey_date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.promise().query(
      `UPDATE bookings SET bus_id=?, customer_name=?, phone=?, amount=?, journey_date=? WHERE id=?`,
      [bus_id, customer_name, phone, amount, journey_date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking updated successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Update booking failed", error: String(e) });
  }
};
