const express = require("express");
const router = express.Router();
const { addBookmark, getMyBookmarks, removeBookmark } = require("../controllers/bookmarkController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.post("/:jobId", protect, authorizeRoles("applicant"), addBookmark);
router.get("/", protect, authorizeRoles("applicant"), getMyBookmarks);
router.delete("/:jobId", protect, authorizeRoles("applicant"), removeBookmark);

module.exports = router;
