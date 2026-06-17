const express = require("express");
const router = express.Router();
const {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
  shareResume,
  getSharedResume,
} = require("../controllers/resume");
const { verifyToken } = require("../middlewares/auth");

router.post("/create", verifyToken, createResume);
router.get("/my", verifyToken, getMyResumes);
router.get("/shared/:token", getSharedResume);
router.get("/:id", verifyToken, getResumeById);
router.put("/:id", verifyToken, updateResume);
router.delete("/:id", verifyToken, deleteResume);
router.post("/:id/duplicate", verifyToken, duplicateResume);
router.put("/:id/share", verifyToken, shareResume);

module.exports = router;