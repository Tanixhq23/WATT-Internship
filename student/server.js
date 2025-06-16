require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Student = require("./models/student");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB: Student"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
