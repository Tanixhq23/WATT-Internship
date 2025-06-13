// 📌 Import modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("./models/User.js");

// 📌 App config
const app = express();
const PORT = 3000;
const dbURI = "mongodb://127.0.0.1:27017/auth-db";

// 📌 MongoDB connection
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// 📌 Middleware
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 📌 Nodemailer Email Config (replace with your Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tanishqlokhande2005@gmail.com", // replace this
    pass: "jbst ljxw vwci qaoh", // replace with your Gmail App Password
  },
});

// 📌 In-memory OTP store (for demo)
const otpMap = new Map();

// 📌 Serve frontend pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "login.html")));
app.get("/register.html", (req, res) =>
  res.sendFile(path.join(__dirname, "register.html"))
);
app.get("/success.html", (req, res) =>
  res.sendFile(path.join(__dirname, "success.html"))
);
app.get("/forgot-password.html", (req, res) =>
  res.sendFile(path.join(__dirname, "forgot-password.html"))
);

// 📌 Send OTP via Email
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpMap.set(email, otp);

  const mailOptions = {
    from: "yourmail@gmail.com", // same as above
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email send error:", error.message);
      res.status(500).json({ message: "Failed to send OTP." });
    } else {
      console.log(`OTP sent to ${email}: ${otp}`);
      res.json({ message: "OTP sent successfully." });
    }
  });
});

// 📌 Verify OTP via Email
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpMap.get(email) == otp) {
    console.log(`OTP verified for ${email}`);
    otpMap.delete(email);
    res.json({ success: true, message: "OTP verified successfully." });
  } else {
    res.json({ success: false, message: "Invalid or expired OTP." });
  }
});

// 📌 User Registration
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      console.log("Registration failed: Username exists:", username);
      return res.redirect("/register.html?error=exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, password: hashedPassword, email });
    await user.save();

    console.log("User registered successfully:", username);
    res.redirect("/login.html?message=registered");
  } catch (err) {
    console.error("Registration error:", err.message);
    res.redirect("/register.html?error=server");
  }
});

// 📌 User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Login failed: User not found for", username);
      return res.redirect("/login.html?error=invalid");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log("Login successful for:", username);
      res.redirect("/success.html");
    } else {
      console.log("Login failed: Incorrect password for", username);
      res.redirect("/login.html?error=invalid");
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.redirect("/login.html?error=server");
  }
});

// 📌 Forgot Password Reset
app.post("/forgot-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "No account with this email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    console.log(`Password reset successful for ${email}`);
    res.json({ success: true, message: "Password reset successful." });
  } catch (err) {
    console.error("Reset error:", err.message);
    res.json({ success: false, message: "Server error." });
  }
});

// 📌 404 Not Found handler
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// 📌 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
