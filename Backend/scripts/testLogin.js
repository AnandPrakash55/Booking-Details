import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const testLogin = async () => {
  try {
    const email = "owner@example.com";
    const password = "admin123";

    console.log("Testing login for:", email);
    console.log("Password:", password);
    console.log("\n1. Checking database connection...");

    const [rows] = await db.promise().query("SELECT * FROM users WHERE email=?", [email]);
    const user = rows[0];

    if (!user) {
      console.log("❌ User not found in database!");
      process.exit(1);
    }

    console.log("✅ User found:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password hash: ${user.password_hash.substring(0, 20)}...`);

    console.log("\n2. Testing password verification...");
    const ok = await bcrypt.compare(password, user.password_hash);
    
    if (ok) {
      console.log("✅ Password verification successful!");
      console.log("\n✅ Login should work!");
    } else {
      console.log("❌ Password verification FAILED!");
      console.log("\n💡 The password hash might be incorrect.");
      console.log("   Let's recreate the user with the correct password...");
      
      // Recreate the user with correct password
      const hash = await bcrypt.hash(password, 10);
      await db.promise().query(
        "UPDATE users SET password_hash = ? WHERE email = ?",
        [hash, email]
      );
      console.log("✅ Password hash updated!");
      console.log("   Try logging in again now.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
};

testLogin();

