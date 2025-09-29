const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); 
const User = require("../models/User"); 
const Bond = require("../models/Bond"); 
const mongoose = require('mongoose'); // Needed for new Date() conversion

// ==========================================================
// POST /api/bonds (CREATE NEW BOND)
// ==========================================================
router.post("/", auth, async (req, res) => {
    // req.user.id comes from the 'auth' middleware
    const userId = req.user.id; 
    
    // Deconstruct fields from the frontend request (bond-setup.html)
    const { 
        bondName, email1, email2, bondType, bondDuration, bondStartDate, bondEndDate 
    } = req.body;

    try {
        // 1. Find both users
        const user1 = await User.findById(userId); // The current logged-in user
        const user2 = await User.findOne({ email: email2 }); // The partner user

        if (!user1 || !user2) {
             // We can check if email1 matches the logged-in user for security/validation
             return res.status(404).json({ message: "Partner email is not registered or user error." });
        }
        
        // 2. Create the Bond instance
        const newBond = new Bond({
            name: bondName,
            type: bondType,
            duration: bondDuration,
            // Convert date strings to Date objects for Mongoose
            startDate: new Date(bondStartDate),
            endDate: new Date(bondEndDate), 
            // Store the MongoDB IDs of both users
            users: [userId, user2._id], 
            creator: userId 
        });

        // 3. Save the Bond
        await newBond.save();

        // 4. CRITICAL FIX: Mark the user as configured in the User model
        await User.findByIdAndUpdate(userId, { isConfigured: true });

        // 5. Success Response (HTTP 201) - Triggers the frontend redirect
        res.status(201).json({ 
            message: "Bond created successfully. Redirecting to dashboard.",
            bond: newBond 
        });

    } catch (err) {
        console.error("Bond Creation Error:", err.message);
        res.status(500).send("Server error during bond creation.");
    }
});

// ==========================================================
// GET /api/bonds (FETCH USER'S BONDS)
// ==========================================================
router.get("/", auth, async (req, res) => {
    try {
        // Find bonds where the current user is listed in the 'users' array
        const bonds = await Bond.find({ users: req.user.id }).populate('users', 'name email');
        res.json(bonds);
    } catch (err) {
        console.error("Bond Fetch Error:", err.message);
        res.status(500).send("Server error fetching bonds.");
    }
});

module.exports = router;