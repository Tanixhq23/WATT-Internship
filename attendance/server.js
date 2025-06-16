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

  const dummyAttendance = [
  {
    cardId: "CARD123",
    time: new Date(),
    deviceActive: true,
    date: new Date(),
    name: "XII-B",
    role: "student",
    deviceId: "DVC001",
  },
];

Attendance.insertMany(dummyAttendance)
  .then(() => console.log("✅ Dummy attendance inserted"))
  .catch((err) => console.error("❌ Insert error:", err));
