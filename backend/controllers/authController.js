const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper: generate JWT ──────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── @route  POST /api/auth/signup ─────────────────────────────────────────────
// ── @access Public
const signup = async (req, res) => {
  try {
    const { username, email, password, role, companyName, companyLocation } = req.body;

    // Validate role — admin cannot self-register
    if (!["applicant", "recruiter"].includes(role)) {
      return res.status(400).json({ message: "Role must be applicant or recruiter" });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User ID already exists. Please login." });
    }

    // Recruiter must provide company info
    if (role === "recruiter" && !companyName) {
      return res.status(400).json({ message: "Company name is required for recruiters" });
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
      companyName: role === "recruiter" ? companyName : null,
      companyLocation: role === "recruiter" ? companyLocation : null,
    });

    res.status(201).json({
      message: "Account created successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  POST /api/auth/login ──────────────────────────────────────────────
// ── @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check blacklist before anything else
    if (user.isBlacklisted) {
      return res.status(403).json({ message: "Your account has been blacklisted. Contact admin." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: `Welcome, ${user.username}`,
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── @route  POST /api/auth/logout ─────────────────────────────────────────────
// ── @access Private
// JWT is stateless — logout is handled client-side by deleting the token.
// This endpoint exists as a clean API contract for the frontend.
const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully. Please delete your token." });
};

module.exports = { signup, login, logout };
