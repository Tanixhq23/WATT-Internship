const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // e.g., "XII-B"
  rollno: { type: String, required: true },
  cardId: { type: String, required: true },
  deviceActive: { type: Boolean, default: true }, // true = online, false = offline
});

module.exports = mongoose.model("Device", DeviceSchema);
