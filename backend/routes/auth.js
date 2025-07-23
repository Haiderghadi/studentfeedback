const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../models/User"); // Student model

const router = express.Router();

const hardcodedUsers = [
  {
    Id: 1,
    username: "aisha",
    FullName: "Aisha Al-Harbi",
    Email: "aisha@ktu.edu.kw",
    role: "student",
  },
  {
    Id: 2,
    username: "fahad",
    FullName: "Fahad Al-Mutairi",
    Email: "fahad@ktu.edu.kw",
    role: "student",
  },
  {
    Id: 999,
    username: "admin1",
    FullName: "System Administrator",
    Email: "admin@ktu.edu.kw",
    role: "admin",
  },
];

// Simulated login endpoint
router.post("/login", async (req, res) => {
  try {
    const { username, role } = req.body;

    if (!username || !role) {
      return res
        .status(400)
        .json({ message: "Username and role are required" });
    }

    // Find hardcoded user
    const user = hardcodedUsers.find(
      (u) => u.username === username && u.role === role
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.Id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        Id: user.Id,
        username: user.username,
        FullName: user.FullName,
        Email: user.Email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Token verification middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user;
      next();
    }
  );
};

// Get current user info
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = { router, authenticateToken };
