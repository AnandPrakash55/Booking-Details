import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const setupDatabase = async () => {
  let connection;
  try {
    // Connect without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("Creating database if it doesn't exist...");
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    console.log("Creating users table...");
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

    console.log("Creating buses table...");
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

    console.log("Creating bookings table...");
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

    console.log("✅ Database setup completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Run: node scripts/createOwner.js [email] [password] [name]");
    console.log("   Example: node scripts/createOwner.js owner@example.com admin123 Owner");
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
};

setupDatabase();

