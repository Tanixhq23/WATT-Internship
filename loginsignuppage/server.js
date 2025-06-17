// 📌 Import modules
require("dotenv").config({ path: "../.env" });
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("./models/user.js");

// New imports for session management
const session = require("express-session");
const MongoStore = require("connect-mongo"); // Use CommonJS syntax

// 📌 App config
const app = express();
const PORT = 4000;

// ✅ Use environment variable for MongoDB URI
const dbURI = process.env.MONGO_URI;

// 📌 MongoDB connection
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// 📌 Middleware
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ⚡️ Session Middleware Configuration ⚡️
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // Replace with a strong, secret key from .env
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    store: MongoStore.create({
      mongoUrl: dbURI, // Your MongoDB connection string
      collectionName: "sessions", // Name of the collection in MongoDB to store sessions
      ttl: 14 * 24 * 60 * 60, // Session TTL (Time To Live) in seconds, 14 days by default
      autoRemove: "interval", // Automatically remove expired sessions
      autoRemoveInterval: 10, // Interval in minutes to check for expired sessions
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Session cookie expiration time in milliseconds (e.g., 24 hours)
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
      sameSite: "lax", // Protects against CSRF attacks
    },
  })
);

// 📌 Nodemailer Email Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tanishqlokhande2005@gmail.com", // Replace with your email
    pass: "jbst ljxw vwci qaoh", // App password
  },
});

// 📌 In-memory OTP store (consider storing in DB for better persistence in production)
const otpMap = new Map();

// 📌 Serve frontend pages
app.get("/", (req, res) => {
  // If a session exists, redirect to dashboard, otherwise to login
  if (req.session.userId) {
    res.redirect("/dashboard.html");
  } else {
    res.redirect("/login.html");
  }
});

// 📌 User Registration
app.post("/register", async (req, res) => {
  const { name, designation, organization, username, email, password } =
    req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("Username already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      designation,
      organization,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("New user registered:", username);
    res.redirect("/login.html");
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("Server error during registration.");
  }
});

// 📌 User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // ⚡️ Session Creation on Successful Login ⚡️
      req.session.userId = user._id; // Store user ID in session
      req.session.username = user.username; // Store username in session
      console.log("Login successful for:", email);
      res.status(200).json({ message: "Login successful" });
    } else {
      console.log("Login failed: Incorrect password for", email);
      res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Logout Route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Could not log out." });
    }
    res.status(200).json({ message: "Logged out successfully." });
  });
});

// 📌 Forgot Password Reset (Existing logic, no change needed for session here)
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
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 📌 Send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    otpMap.set(email, otp); // Store OTP in memory (for simplicity, consider a database in production)

    const mailOptions = {
      from: "tanishqlokhande2005@gmail.com", // Your email
      to: email,
      subject: "Your OTP for Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>Password Reset OTP</h2>
            <p>Hello,</p>
            <p>You recently requested to reset your password. Your One-Time Password (OTP) is:</p>
            <p style="font-size: 24px; font-weight: bold; color: #0056b3; background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">${otp}</p>
            <p>This OTP is valid for 5 minutes.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Thank you,</p>
            <p>Your Application Team</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending OTP email." });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "OTP sent to your email." });
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Server error during OTP send." });
  }
});

// 📌 Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpMap.get(email);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP." });
  }

  // OTP is valid, remove it to prevent reuse
  otpMap.delete(email);
  res.status(200).json({ success: true, message: "OTP verified successfully." });
});

// 📌 Example of a protected route
app.get("/dashboard.html", (req, res, next) => {
  if (req.session.userId) {
    next(); // User is authenticated, proceed to serve the file
  } else {
    // User is not authenticated, redirect to login
    res.redirect("/login.html");
  }
});

app.get("/user.html", (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect("/login.html");
    }
});

app.get("/changePassword.html", (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect("/login.html");
    }
});
// Add similar checks for other protected HTML files as needed

// 📌 Server listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open in browser: http://localhost:${PORT}`);
});