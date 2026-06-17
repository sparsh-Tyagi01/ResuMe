const express = require("express");
const router = express.Router();
const {
  createTemplate,
  getTemplates,
  deleteTemplate,
} = require("../controllers/template");
const { verifyToken, adminOnly } = require("../middlewares/auth");

router.get("/", getTemplates);
router.post("/create", verifyToken, adminOnly, createTemplate);
router.delete("/:id", verifyToken, adminOnly, deleteTemplate);

module.exports = router;
