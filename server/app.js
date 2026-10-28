const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const interestRoutes = require("./routes/interestRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/interests", interestRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;