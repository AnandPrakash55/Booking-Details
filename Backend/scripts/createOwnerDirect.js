import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const createOwnerDirect = async () => {
  let connection;
  try {
    const email = process.argv[2] || "owner@example.com";
    const password = process.argv[3] || "admin123";
    const name = process.argv[4] || "Owner";

    console.log("Connecting to MySQL...");
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected to MySQL!");

    // Check if users table exists, if not create it
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('owner', 'driver') NOT NULL,
        bus_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if owner already exists
    const [existing] = await connection.query("SELECT id FROM users WHERE email=?", [email]);
    if (existing.length > 0) {
      console.log("❌ Owner with this email already exists!");
      await connection.end();
      process.exit(1);
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert owner
    const [result] = await connection.query(
      "INSERT INTO users (name, email, password_hash, role, bus_id) VALUES (?,?,?,?,?)",
      [name, email, hash, "owner", null]
    );

    console.log("✅ Owner account created successfully!");
    console.log(`Owner ID: ${result.insertId}`);
    console.log(`\n📧 Login Credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`\n🌐 You can now login at: http://localhost:5173`);
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\n💡 Make sure:");
    console.error("1. MySQL is running");
    console.error("2. Database credentials in .env are correct");
    console.error("3. Database 'booking_db' exists (or update DB_NAME in .env)");
    if (connection) await connection.end();
    process.exit(1);
  }
};

createOwnerDirect();

