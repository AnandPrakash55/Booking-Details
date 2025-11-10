import { db } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const checkUsers = async () => {
  try {
    console.log("Checking users in database...");
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}`);
    
    const [rows] = await db.promise().query("SELECT id, name, email, role, bus_id FROM users");
    
    if (rows.length === 0) {
      console.log("❌ No users found in database!");
      console.log("\n💡 To create an owner account, run:");
      console.log("   node scripts/createOwnerDirect.js [email] [password] [name]");
      console.log("\n   Example:");
      console.log("   node scripts/createOwnerDirect.js owner@example.com admin123 Owner");
    } else {
      console.log(`\n✅ Found ${rows.length} user(s):\n`);
      rows.forEach((user) => {
        console.log(`ID: ${user.id}`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Bus ID: ${user.bus_id || "N/A"}`);
        console.log("---");
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking users:", error.message);
    console.error("\n💡 Make sure:");
    console.error("1. MySQL is running");
    console.error("2. Database credentials in .env are correct");
    console.error("3. Database and tables exist (run: node scripts/setupDatabase.js)");
    process.exit(1);
  }
};

checkUsers();

