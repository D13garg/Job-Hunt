const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Applicant ID is required"],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
  },
  { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
bookmarkSchema.index({ applicantId: 1 });                    // fetch all bookmarks for a user
bookmarkSchema.index(
  { applicantId: 1, jobId: 1 },
  { unique: true }                                           // no duplicate bookmarks
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);
