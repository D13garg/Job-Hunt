const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

// ── @route  POST /api/applications/:jobId ────────────────────────────────────
// ── @access Applicant
const applyToJob = async (req, res) => {
  try {
    const { linkedinProfile, githubProfile } = req.body;
    const jobId = req.params.jobId;

    // Check job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found or no longer active" });
    }

    // Check for duplicate application
    const existing = await Application.findOne({ applicantId: req.user._id, jobId });
    if (existing && !existing.isWithdrawn) {
      return res.status(409).json({ message: "You have already applied to this job" });
    }

    // If previously withdrawn, create fresh application
    if (existing && existing.isWithdrawn) {
      await existing.deleteOne();
    }

    const application = await Application.create({
      jobId,
      applicantId: req.user._id,
      applicantName: req.user.username,
      linkedinProfile,
      githubProfile: githubProfile || null,
    });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  GET /api/applications/my-applications ────────────────────────────
// ── @access Applicant
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicantId: req.user._id,
      isWithdrawn: false,
    })
      .populate("jobId", "title companyName location salary category")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: applications.length, applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  DELETE /api/applications/:applicationId/withdraw ─────────────────
// ── @access Applicant
const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.applicantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    if (application.isWithdrawn) {
      return res.status(400).json({ message: "Application already withdrawn" });
    }

    // Mark as withdrawn
    application.isWithdrawn = true;
    application.withdrawnAt = new Date();
    await application.save();

    // Increment withdrawal count on user — $inc in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { withdrawalCount: 1 } },
      { new: true }
    );

    res.status(200).json({
      message: "Application withdrawn",
      totalWithdrawals: updatedUser.withdrawalCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  GET /api/applications/job/:jobId ─────────────────────────────────
// ── @access Recruiter (own job) | Admin
const getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Recruiter can only view responses for their own jobs
    if (
      req.user.role === "recruiter" &&
      job.recruiterId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status } = req.query;
    const filter = { jobId: req.params.jobId, isWithdrawn: false };
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate("applicantId", "username email linkedinProfile githubProfile withdrawalCount")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: applications.length, applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  PUT /api/applications/:applicationId/status ──────────────────────
// ── @access Recruiter (own job)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, statusReason } = req.body;

    const application = await Application.findById(req.params.applicationId).populate("jobId");
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Ensure recruiter owns the job
    if (
      req.user.role === "recruiter" &&
      application.jobId.recruiterId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    application.statusReason = statusReason || "";
    await application.save();

    res.status(200).json({ message: "Status updated", application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  withdrawApplication,
  getApplicationsForJob,
  updateApplicationStatus,
};
