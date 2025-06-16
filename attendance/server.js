// 📌 Load environment variables
require("dotenv").config({ path: "../.env" }); // adjust if needed

// 📌 Import modules
const mongoose = require("mongoose");
const Attendance = require("./models/serialAttendance");

// 📌 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected to Attendance DB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
