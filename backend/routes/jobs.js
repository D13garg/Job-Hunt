const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect, authorizeRoles } = require("../middleware/auth");

// Public
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Recruiter only
router.post("/", protect, authorizeRoles("recruiter"), createJob);
router.get("/recruiter/my-jobs", protect, authorizeRoles("recruiter"), getMyJobs);
router.put("/:id", protect, authorizeRoles("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorizeRoles("recruiter", "admin"), deleteJob);

module.exports = router;
