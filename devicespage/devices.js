// Devices/devices.js
const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // e.g., "XII-B"
  deviceActive: { type: Boolean, default: true } // true = online, false = offline
});

module.exports = mongoose.model("Device", DeviceSchema);
