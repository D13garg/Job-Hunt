const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// ── @route  GET /api/admin/users ──────────────────────────────────────────────
// ── @access Admin
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  PUT /api/admin/users/:userId/blacklist ────────────────────────────
// ── @access Admin
const toggleBlacklist = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot blacklist an admin" });
    }

    user.isBlacklisted = !user.isBlacklisted;
    await user.save();

    res.status(200).json({
      message: `User ${user.isBlacklisted ? "blacklisted" : "un-blacklisted"} successfully`,
      isBlacklisted: user.isBlacklisted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  GET /api/admin/jobs ───────────────────────────────────────────────
// ── @access Admin (sees ALL jobs including inactive)
const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find({})
      .populate("recruiterId", "username email companyName")
      .sort({ createdAt: -1 });
    res.status(200).json({ count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  DELETE /api/admin/jobs/:jobId ─────────────────────────────────────
// ── @access Admin
const adminDeleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  PUT /api/admin/jobs/:jobId ────────────────────────────────────────
// ── @access Admin
const adminUpdateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job updated by admin", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  GET /api/admin/stats ──────────────────────────────────────────────
// ── @access Admin
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications, blacklistedUsers] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      Job.countDocuments(),
      Application.countDocuments({ isWithdrawn: false }),
      User.countDocuments({ isBlacklisted: true }),
    ]);

    res.status(200).json({ totalUsers, totalJobs, totalApplications, blacklistedUsers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  toggleBlacklist,
  getAllJobsAdmin,
  adminDeleteJob,
  adminUpdateJob,
  getDashboardStats,
};
