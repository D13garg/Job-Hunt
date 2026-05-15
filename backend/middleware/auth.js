const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Verify JWT token ──────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Block blacklisted users on every request
    if (user.isBlacklisted) {
      return res.status(403).json({ message: "Your account has been blacklisted. Contact admin." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

// ── Role-based access guard ───────────────────────────────────────────────────
// Usage: authorizeRoles("admin", "recruiter")
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
