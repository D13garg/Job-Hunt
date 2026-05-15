const Job = require("../models/Job");

// ── @route  POST /api/jobs ────────────────────────────────────────────────────
// ── @access Recruiter
const createJob = async (req, res) => {
  try {
    const { title, companyName, location, salary, description, category, tags, requirements } = req.body;

    const job = await Job.create({
      recruiterId: req.user._id,
      title,
      companyName,
      location,
      salary,
      description,
      category,
      tags: tags || [],
      requirements: requirements || [],
    });

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  GET /api/jobs ─────────────────────────────────────────────────────
// ── @access Public (applicants + admin)
// Supports: ?category= &location= &minSalary= &maxSalary= &keyword= &sortBy=salary_asc|salary_desc|newest
const getAllJobs = async (req, res) => {
  try {
    const { category, location, minSalary, maxSalary, keyword, sortBy } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, "i");
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    // Full-text search across title, description, tags
    if (keyword) {
      filter.$text = { $search: keyword };
    }

    const sortOptions = {
      salary_asc: { salary: 1 },
      salary_desc: { salary: -1 },
      newest: { createdAt: -1 },
    };
    const sort = sortOptions[sortBy] || { createdAt: -1 };

    const jobs = await Job.find(filter)
      .sort(sort)
      .populate("recruiterId", "username email companyName companyLocation");

    res.status(200).json({ count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  GET /api/jobs/:id ─────────────────────────────────────────────────
// ── @access Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiterId",
      "username email companyName companyLocation"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  GET /api/jobs/my-jobs ─────────────────────────────────────────────
// ── @access Recruiter
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  PUT /api/jobs/:id ─────────────────────────────────────────────────
// ── @access Recruiter (own jobs) | Admin (any job)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Recruiter can only edit their own jobs
    if (req.user.role === "recruiter" && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Job updated", job: updatedJob });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  DELETE /api/jobs/:id ──────────────────────────────────────────────
// ── @access Recruiter (own jobs) | Admin (any job)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role === "recruiter" && job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createJob, getAllJobs, getJobById, getMyJobs, updateJob, deleteJob };
