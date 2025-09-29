const mongoose = require("mongoose");

const BondSchema = new mongoose.Schema({
    // Changed from 'bondName' to 'name' for simplicity, matching the route
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    duration: { // in days
        type: Number, 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    // CRITICAL: Array of User Object IDs for both partners
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    // The user who created the bond
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Bond", BondSchema);