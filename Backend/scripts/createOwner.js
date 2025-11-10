import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const createOwner = async () => {
  try {
    const email = process.argv[2] || "owner@example.com";
    const password = process.argv[3] || "admin123";
    const name = process.argv[4] || "Owner";

    console.log("Creating owner account...");
    console.log(`Email: ${email}`);
    console.log(`Name: ${name}`);

    // Check if owner already exists
    const [existing] = await db.promise().query("SELECT id FROM users WHERE email=?", [email]);
    if (existing.length > 0) {
      console.log("❌ Owner with this email already exists!");
      process.exit(1);
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert owner
    const [result] = await db.promise().query(
      "INSERT INTO users (name, email, password_hash, role, bus_id) VALUES (?,?,?,?,?)",
      [name, email, hash, "owner", null]
    );

    console.log("✅ Owner account created successfully!");
    console.log(`Owner ID: ${result.insertId}`);
    console.log(`\nYou can now login with:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating owner:", error.message);
    process.exit(1);
  }
};

createOwner();

