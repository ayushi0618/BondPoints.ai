const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================================
// 1. SIGNUP ROUTE 
// ==========================================================
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // User creation
        user = new User({ 
            name, 
            email, 
            password: await bcrypt.hash(password, 10) 
        }); 
        
        await user.save();

        const payload = { user: { id: user.id } };
        const secret = process.env.JWT_SECRET.trim(); // Add .trim() for safety

        // Use the ASYNCHRONOUS form of jwt.sign for robust error handling
        jwt.sign(payload, secret, { expiresIn: "7d" }, (err, token) => {
            if (err) {
                console.error("JWT Sign Error on Signup:", err);
                return res.status(500).send("Token generation failed");
            }

            // Success: New signup, redirect to bond setup page
            res.json({ 
                token,
                redirectUrl: "bond-setup.html" // Sends the target URL to the frontend
            });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// ==========================================================
// 2. LOGIN ROUTE 
// ==========================================================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const payload = { user: { id: user.id } };
        const secret = process.env.JWT_SECRET.trim(); // Add .trim() for safety

        // CRITICAL LOGIC: Check configuration status
        const redirectUrl = user.isConfigured ? "dashboard.html" : "bond-setup.html";

        // Use the ASYNCHRONOUS form of jwt.sign for robust error handling
        jwt.sign(payload, secret, { expiresIn: "7d" }, (err, token) => {
            if (err) {
                console.error("JWT Sign Error on Login:", err);
                return res.status(500).send("Token generation failed");
            }

            // Success: Send the token and conditional redirect URL
            res.json({ 
                token,
                redirectUrl // Sends the conditional target URL to the frontend
            });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;