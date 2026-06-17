const express = require("express");
const router = express.Router();
const { generateSuggestion } = require("../controllers/ai");
const { verifyToken } = require("../middlewares/auth");

router.post("/suggest", verifyToken, generateSuggestion);

module.exports = router;
