// 📌 Load environment variables
require("dotenv").config({ path: "../.env" });

// 📌 Import modules
const mongoose = require("mongoose");
const attendanceLogs = require("./models/attendancelogs");

// 📌 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB: Attendance Logs");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

 const dummyLogs = [
  {
    time: new Date().toISOString(),
    eventName: "CARD_TAP",
    payload: "CARD123",
    result: "Access Granted",
  },
];

attendanceLogs.insertMany(dummyLogs)
  .then(() => console.log("✅ Dummy attendance log inserted"))
  .catch((err) => console.error("❌ Insert error:", err));
