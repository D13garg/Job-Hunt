const Bookmark = require("../models/Bookmark");
const Job = require("../models/Job");

// ── @route  POST /api/bookmarks/:jobId ───────────────────────────────────────
// ── @access Applicant
const addBookmark = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existing = await Bookmark.findOne({
      applicantId: req.user._id,
      jobId: req.params.jobId,
    });
    if (existing) {
      return res.status(409).json({ message: "Job already bookmarked" });
    }

    const bookmark = await Bookmark.create({
      applicantId: req.user._id,
      jobId: req.params.jobId,
    });

    res.status(201).json({ message: "Job bookmarked", bookmark });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  GET /api/bookmarks ────────────────────────────────────────────────
// ── @access Applicant
const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ applicantId: req.user._id })
      .populate("jobId", "title companyName location salary category description tags")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: bookmarks.length, bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  DELETE /api/bookmarks/:jobId ─────────────────────────────────────
// ── @access Applicant
const removeBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      applicantId: req.user._id,
      jobId: req.params.jobId,
    });

    if (!bookmark) return res.status(404).json({ message: "Bookmark not found" });

    res.status(200).json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addBookmark, getMyBookmarks, removeBookmark };
