const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // MySQL database connection
const authMiddleware = require("./middleware");
require("dotenv").config();

const router = express.Router();

// Secret Key for JWT (from .env file)
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ User Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, skills, causes } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    // Check if email is already registered
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (result.length > 0) return res.status(400).json({ message: "Email already exists" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into database
      db.query(
        "INSERT INTO users (name, email, password, skills, causes) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, skills, causes],
        (err, result) => {
          if (err) return res.status(500).json({ message: "Error creating user" });
          res.status(201).json({ message: "User registered successfully" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ User Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.status(401).json({ message: "Invalid email or password" });

    const user = result[0];

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user.id, message: "Login successful" });
  });
});



router.put("/update-profile", authMiddleware, (req, res) => {
  const { name, skills, causes, password } = req.body;
  const userId = req.user.userId;

  let updateFields = { name, skills, causes };

  if (password) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error("Error generating salt:", err);
        return res.status(500).json({ message: "Error updating password" });
      }

      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ message: "Error updating password" });
        }

        updateFields.password = hashedPassword;

        db.query("UPDATE users SET ? WHERE id = ?", [updateFields, userId], (err, result) => {
          if (err) {
            console.error("Error updating profile:", err);
            return res.status(500).json({ message: "Failed to update profile" });
          }
          res.json({ message: "Profile updated successfully!" });
        });
      });
    });
  } else {
    db.query("UPDATE users SET ? WHERE id = ?", [updateFields, userId], (err, result) => {
      if (err) {
        console.error("Error updating profile:", err);
        return res.status(500).json({ message: "Failed to update profile" });
      }
      res.json({ message: "Profile updated successfully!" });
    });
  }
});



// ✅ Get Logged-in User Details (Protected Route)
router.get("/user", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.query("SELECT id, name, email, skills, causes FROM users WHERE id = ?", [decoded.userId], (err, result) => {
      if (err || result.length === 0) return res.status(404).json({ message: "User not found" });
      res.json({ user: result[0] });
    });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});



module.exports = router;