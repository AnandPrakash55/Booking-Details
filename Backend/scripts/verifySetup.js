import { db } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const verifySetup = async () => {
  try {
    console.log("🔍 Verifying setup...\n");
    
    console.log("1. Checking environment variables...");
    console.log(`   DB_HOST: ${process.env.DB_HOST}`);
    console.log(`   DB_USER: ${process.env.DB_USER}`);
    console.log(`   DB_NAME: ${process.env.DB_NAME}`);
    console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? "✅ Set" : "❌ Not set"}`);
    console.log(`   PORT: ${process.env.PORT || 5000}\n`);

    console.log("2. Testing database connection...");
    const [rows] = await db.promise().query("SELECT 1 as test");
    console.log("   ✅ Database connection successful\n");

    console.log("3. Checking users table...");
    const [users] = await db.promise().query("SELECT COUNT(*) as count FROM users");
    console.log(`   ✅ Users table exists (${users[0].count} users)\n`);

    console.log("4. Checking for owner account...");
    const [owners] = await db.promise().query("SELECT * FROM users WHERE email = ?", ["owner@example.com"]);
    if (owners.length > 0) {
      console.log("   ✅ Owner account exists:");
      console.log(`      Email: ${owners[0].email}`);
      console.log(`      Role: ${owners[0].role}`);
      console.log(`      Name: ${owners[0].name}\n`);
    } else {
      console.log("   ❌ Owner account not found!\n");
    }

    console.log("✅ Setup verification complete!");
    console.log("\n💡 If login still fails:");
    console.log("   1. Make sure backend server is running (npm run dev)");
    console.log("   2. Check browser console for errors");
    console.log("   3. Check backend server logs for login attempts");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Setup verification failed:", error.message);
    console.error("\n💡 Common issues:");
    console.error("   1. Database not created - run: node scripts/setupDatabase.js");
    console.error("   2. Wrong MySQL credentials - check .env file");
    console.error("   3. MySQL not running - start MySQL service");
    process.exit(1);
  }
};

verifySetup();

