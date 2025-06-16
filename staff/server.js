require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Staff = require("./models/staff");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB: Staff"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
const dummyStaff = [
  {
    staffId: "STF001",
    name: "Aarti Mehta",
    cardId: "CARD987",
    deviceActive: true,
  },
];

Staff.insertMany(dummyStaff)
  .then(() => console.log("✅ Dummy staff inserted"))
  .catch((err) => console.error("❌ Insert error:", err));
