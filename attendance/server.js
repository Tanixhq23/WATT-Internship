// 📌 Load environment variables
require("dotenv").config({ path: "../.env" }); // Adjust path if needed

// 📌 Import modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

// Assuming you have this model in your 'models' directory
const Attendance = require("./models/serialAttendance"); // Make sure this path is correct

// 📌 App config
const app = express();
const PORT = 4000;

// ✅ Use environment variable for MongoDB URI
const dbURI = process.env.MONGO_URI;

// 📌 MongoDB connection
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// 📌 Middleware
app.use(express.static(__dirname)); // Serves static files (including viewAttendance.html) from the current directory
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ⚡️ API endpoint to fetch attendance data ⚡️
// This endpoint is NOT protected by authentication in this simplified version
app.get("/api/attendance", async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({}); // Fetch all attendance records
    res.json(attendanceRecords); // Send them as JSON
  } catch (err) {
    console.error("Error fetching attendance data:", err);
    res.status(500).json({ message: "Failed to fetch attendance data." });
  }
});

// 📌 Serve viewAttendance.html directly for this simplified example
app.get("/viewAttendance.html", (req, res) => {
  res.sendFile(path.join(__dirname, "viewAttendance.html"));
});

// Optional: Redirect root to viewAttendance.html for easy access
app.get("/", (req, res) => {
  res.redirect("/viewAttendance.html");
});


// 📌 Server listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open in browser: http://localhost:${PORT}/viewAttendance.html`);
});