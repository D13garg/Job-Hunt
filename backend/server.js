require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes        = require("./routes/auth");
const jobRoutes         = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const bookmarkRoutes    = require("./routes/bookmarks");
const adminRoutes       = require("./routes/admin");

const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/jobs",         jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/bookmarks",    bookmarkRoutes);
app.use("/api/admin",        adminRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "JobHunt API running" }));

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
