const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Applicant ID is required"],
    },

    // ── Applicant-provided at apply time ──────────────────────────────────────
    applicantName: {
      type: String,
      required: [true, "Applicant name is required"],
      trim: true,
    },
    linkedinProfile: {
      type: String,
      required: [true, "LinkedIn profile is required"],
    },
    githubProfile: {
      type: String,
      default: null, // optional
    },

    // ── Status managed by recruiter ───────────────────────────────────────────
    status: {
      type: String,
      enum: ["in_progress", "shortlisted", "rejected"],
      default: "in_progress",
    },
    statusReason: {
      type: String,
      default: "", // optional note from recruiter
      trim: true,
    },

    // ── Withdrawal tracking ───────────────────────────────────────────────────
    isWithdrawn: { type: Boolean, default: false },
    withdrawnAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
applicationSchema.index({ applicantId: 1 });
applicationSchema.index({ jobId: 1 });
applicationSchema.index({ jobId: 1, status: 1 });           // recruiter filters by status
applicationSchema.index(
  { applicantId: 1, jobId: 1 },
  { unique: true }                                          // prevent duplicate applications
);

module.exports = mongoose.model("Application", applicationSchema);
