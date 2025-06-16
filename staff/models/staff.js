const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cardId: { type: String, required: true },
  deviceActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Staff", StaffSchema);
