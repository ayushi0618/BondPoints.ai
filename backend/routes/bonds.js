const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Bond = require("../models/Bond");

// Create bond
router.post("/", auth, async (req, res) => {
  try {
    const bond = new Bond({ ...req.body, createdBy: req.user.id });
    await bond.save();
    res.json(bond);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get all bonds for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const bonds = await Bond.find({ createdBy: req.user.id });
    res.json(bonds);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
