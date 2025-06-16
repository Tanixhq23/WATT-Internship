const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  cardId: { type: String, required: true },
  time: { type: Date, required: true }, // use Date type for timestamps
  deviceActive: { type: Boolean, default: true },
  date: { type: Date, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  deviceId: { type: String, required: true },
});

module.exports = mongoose.model("Device", DeviceSchema);
