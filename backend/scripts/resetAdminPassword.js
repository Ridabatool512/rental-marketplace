require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const readline = require("readline");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  try {
    const password = await new Promise((resolve) => {
      rl.question("Enter a NEW admin password (minimum 8 characters): ", resolve);
    });

    if (password.length < 8) {
      throw new Error("Password must contain at least 8 characters.");
    }

    await connectDB();

    const admin = await User.findOne({
      email: "admin@rentalmarketplace.com",
      role: "admin",
    }).select("+password");

    if (!admin) {
      throw new Error("Admin account not found. No changes made.");
    }

    admin.password = await bcrypt.hash(password, 12);
    await admin.save();

    console.log("Admin password reset successfully.");
    console.log("Email: admin@rentalmarketplace.com");
    console.log("Role:", admin.role);
  } catch (error) {
    console.error("Password reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
})();
