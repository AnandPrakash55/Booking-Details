import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import readline from "readline";
import dotenv from "dotenv";
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const quickSetup = async () => {
  let connection;
  try {
    console.log("🚀 Quick Setup for Booking System\n");
    console.log("This script will:");
    console.log("1. Create the database and tables");
    console.log("2. Create an owner account\n");

    // Get MySQL password if needed
    const dbPassword = await question("MySQL root password (press Enter if no password): ");
    const email = await question("Owner email (default: owner@example.com): ") || "owner@example.com";
    const password = await question("Owner password (default: admin123): ") || "admin123";
    const name = await question("Owner name (default: Owner): ") || "Owner";

    console.log("\n📦 Setting up database...");

    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: dbPassword || process.env.DB_PASSWORD || "",
    });

    console.log("✅ Connected to MySQL");

    // Create database
    console.log("Creating database...");
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "booking_db"}`);
    await connection.query(`USE ${process.env.DB_NAME || "booking_db"}`);

    // Create tables
    console.log("Creating tables...");
    
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

    await connection.query(`
      CREATE TABLE IF NOT EXISTS buses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bus_number VARCHAR(50) UNIQUE NOT NULL,
        route_from VARCHAR(255) NOT NULL,
        route_to VARCHAR(255) NOT NULL,
        total_seats INT NOT NULL,
        driver_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bus_id INT NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        journey_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Database and tables created");

    // Check if user exists
    const [existing] = await connection.query("SELECT id FROM users WHERE email=?", [email]);
    if (existing.length > 0) {
      console.log(`\n⚠️  User with email ${email} already exists. Skipping user creation.`);
    } else {
      // Create owner
      console.log("Creating owner account...");
      const hash = await bcrypt.hash(password, 10);
      const [result] = await connection.query(
        "INSERT INTO users (name, email, password_hash, role, bus_id) VALUES (?,?,?,?,?)",
        [name, email, hash, "owner", null]
      );
      console.log(`✅ Owner account created (ID: ${result.insertId})`);
    }

    console.log("\n🎉 Setup completed successfully!");
    console.log("\n📧 Login Credentials:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log("\n🌐 You can now login at: http://localhost:5173");

    await connection.end();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("1. Make sure MySQL is running");
    console.error("2. Check your MySQL credentials");
    console.error("3. Try running the SQL file manually: mysql -u root -p < scripts/init.sql");
    if (connection) await connection.end();
    rl.close();
    process.exit(1);
  }
};

quickSetup();

