const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/bonds", require("./routes/bonds"));

// ----------------------------------------------------------------

app.get("/", (req, res) => {
    res.status(200).json({ 
        status: "success", 
        message: "BondPoints.ai API is online and running.",
        available_routes: ["/api/auth", "/api/bonds"] 
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB initial connection failed:", err.message));

// Keep the process alive on later DB hiccups (DNS blips, Atlas pause, failover):
// without these listeners an 'error' event or rejected promise kills the Node process.
mongoose.connection.on("error", err => console.error("MongoDB connection error:", err.message));
mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected; driver will retry..."));
process.on("unhandledRejection", err => console.error("Unhandled rejection:", err && err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
