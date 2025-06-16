// 📌 Load environment variables
require("dotenv").config({ path: "../.env" });

// 📌 Import modules
const mongoose = require("mongoose");
const AttendanceLog = require("./models/attendancelogs");

// 📌 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB: Attendance Logs");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
