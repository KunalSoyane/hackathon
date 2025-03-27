require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Temporary User Database (Replace with DB in production)
const users = {};

// Secret Key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// 🚀 **User Registration API**
router.post("/register", async (req, res) => {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    if (users[phone]) {
        return res.status(400).json({ message: "User already registered!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user
    users[phone] = { name, phone, password: hashedPassword };

    res.json({ message: "User registered successfully!" });
});

// 🚀 **User Login API**
router.post("/login", async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = users[phone];
    if (!user) {
        return res.status(401).json({ message: "User not found!" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate JWT Token
    const token = jwt.sign({ phone: user.phone, name: user.name }, JWT_SECRET, {
        expiresIn: "1h",
    });

    res.json({ message: "Login successful!", token });
});

// 🚀 **Middleware: Verify JWT Token**
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token!" });
    }
};

module.exports = { router, verifyToken };
