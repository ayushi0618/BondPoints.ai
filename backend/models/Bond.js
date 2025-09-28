const mongoose = require("mongoose");

const BondSchema = new mongoose.Schema({
  bondName: { type: String, required: true },
  email1: { type: String, required: true },
  email2: { type: String, required: true },
  bondType: { type: String, required: true },
  bondDuration: { type: Number, required: true },
  bondStartDate: { type: String, required: true },
  bondEndDate: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Bond", BondSchema);
