const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  withdrawApplication,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorizeRoles } = require("../middleware/auth");

// Applicant
router.post("/:jobId", protect, authorizeRoles("applicant"), applyToJob);
router.get("/my/applications", protect, authorizeRoles("applicant"), getMyApplications);
router.delete("/:applicationId/withdraw", protect, authorizeRoles("applicant"), withdrawApplication);

// Recruiter + Admin
router.get("/job/:jobId", protect, authorizeRoles("recruiter", "admin"), getApplicationsForJob);
router.put("/:applicationId/status", protect, authorizeRoles("recruiter", "admin"), updateApplicationStatus);

module.exports = router;
