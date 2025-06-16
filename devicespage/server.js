// Devices/server.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Device = require("./devices.js"); // Device schema

const app = express();
const PORT = 4000;
const DB_URI = "mongodb://127.0.0.1:27017/devices-db";

// Connect to MongoDB
mongoose
  .connect(DB_URI)
  .then(() => console.log("MongoDB connected to devices-db"))
  .catch((err) => console.error("MongoDB error:", err));

// Serve static files (like devices.html)
app.use(express.static(path.join(__dirname)));

// API to return all devices
app.get("/api/devices", async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Serve the devices page
app.get("/devices.html", (req, res) => {
  res.sendFile(path.join(__dirname, "devices.html"));
});

// (Optional) Insert dummy devices once
// Uncomment this block, run once, then comment or remove

const dummyDevices = [
  { deviceId: "DVC001", name: "XII-A", deviceActive: true },
  { deviceId: "DVC002", name: "XII-B", deviceActive: false },
  { deviceId: "DVC003", name: "XI-A", deviceActive: true },
  { deviceId: "DVC004", name: "X-A", deviceActive: false },
  { deviceId: "DVC005", name: "IX-B", deviceActive: true },
];

Device.insertMany(dummyDevices)
  .then(() => console.log("Dummy devices inserted"))
  .catch((err) => console.error("Insert error:", err));

app.listen(PORT, () => {
  console.log(
    `Devices server running at http://localhost:${PORT}/devices.html`
  );
});
