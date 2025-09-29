// backend/models/User.js (Ensure this is updated)

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // CRITICAL: This field controls the redirection logic
    isConfigured: { 
        type: Boolean,
        default: false, // New users start as NOT configured
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', UserSchema);