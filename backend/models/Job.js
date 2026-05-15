const mongoose = require("mongoose");

const requirementSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      default: "intermediate",
    },
    required: { type: Boolean, default: true },
  },
  { _id: false } // nested subdoc, no separate _id needed
);

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recruiter ID is required"],
    },

    // ── Core Info ────────────────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },

    // ── Category ─────────────────────────────────────────────────────────────
    category: {
      type: String,
      enum: ["computer", "analytics", "design", "electronics"],
      required: [true, "Category is required"],
    },

    // ── Nested Arrays (MongoDB feature showcase) ──────────────────────────────
    tags: [{ type: String, trim: true }], // e.g. ["Frontend", "React", "Remote"]

    requirements: [requirementSchema], // nested array of subdocuments

    // ── Status ────────────────────────────────────────────────────────────────
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
jobSchema.index({ category: 1 });
jobSchema.index({ salary: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ recruiterId: 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ category: 1, salary: -1 }); // compound: filter + sort
jobSchema.index(
  { title: "text", description: "text", tags: "text" },
  { name: "job_text_search" }
); // full-text search

module.exports = mongoose.model("Job", jobSchema);
