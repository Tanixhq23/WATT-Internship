const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.js");

const app = express();
const PORT = 3000;

const dbURI = "mongodb://127.0.0.1:27017/auth-db";

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/success.html", (req, res) => {
  res.sendFile(path.join(__dirname, "success.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/forgot-password.html", (req, res) => {
  res.sendFile(path.join(__dirname, "forgot-password.html"));
});

// Register New User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) return res.redirect("/register.html?error=exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, password: hashedPassword });
    await user.save();

    res.redirect("/login.html?message=registered");
  } catch (err) {
    console.error("Registration error:", err.message);
    res.redirect("/register.html?error=server");
  }
});

// Login Existing User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.redirect("/login.html?error=invalid");

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.redirect("/success.html");
    } else {
      res.redirect("/login.html?error=invalid");
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.redirect("/login.html?error=server");
  }
});

// Forgot Password (via Username)
app.post("/forgot-password", async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.redirect("/forgot-password.html?error=invalid");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.redirect("/login.html?message=reset");
  } catch (err) {
    console.error("Password reset error:", err.message);
    res.redirect("/forgot-password.html?error=server");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});
