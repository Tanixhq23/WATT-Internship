const mongoose = require("mongoose"); // ✅ This line was missing

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  rollno: { type: String, required: true },
  cardId: { type: String, required: true },
  deviceActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Student", StudentSchema);
