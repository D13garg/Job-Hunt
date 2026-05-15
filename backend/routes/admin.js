const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  toggleBlacklist,
  getAllJobsAdmin,
  adminDeleteJob,
  adminUpdateJob,
  getDashboardStats,
} = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/auth");

const adminOnly = [protect, authorizeRoles("admin")];

router.get("/stats", ...adminOnly, getDashboardStats);
router.get("/users", ...adminOnly, getAllUsers);
router.put("/users/:userId/blacklist", ...adminOnly, toggleBlacklist);
router.get("/jobs", ...adminOnly, getAllJobsAdmin);
router.put("/jobs/:jobId", ...adminOnly, adminUpdateJob);
router.delete("/jobs/:jobId", ...adminOnly, adminDeleteJob);

module.exports = router;
