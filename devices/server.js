// Devices/server.js
require("dotenv").config({ path: "../.env" });

const express = require("express");
const mongoose = require("mongoose");
const Device = require("./models/devices");

const app = express();
const PORT = 4000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected to devices-db"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.json());

// API to get all devices
app.get("/api/devices", async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Devices API running at http://localhost:${PORT}/api/devices`);
});
