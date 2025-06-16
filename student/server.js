require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Student = require("./models/student");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB: Student"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
  const dummyStudents = [
  {
    studentId: "STU001",
    name: "Rahul Sharma",
    rollno: "23",
    cardId: "CARD123",
    deviceActive: true,
  },
];

Student.insertMany(dummyStudents)
  .then(() => console.log("✅ Dummy student inserted"))
  .catch((err) => console.error("❌ Insert error:", err));

