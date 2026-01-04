const express = require("express")
const router = express.Router()
const {createTemplate, getTemplates, getTemplatesById, deleteTemplate, updateTemplate} = require("../controllers/template")
const {verifyToken, adminOnly} = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");

const multiUpload = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "html", maxCount: 1 }
]);

router.post("/create", verifyToken, adminOnly, multiUpload, createTemplate)
router.get("/all", getTemplates)
router.get("/:id", verifyToken, getTemplatesById)
router.delete("/:id", verifyToken, adminOnly, deleteTemplate)
router.put("/:id", verifyToken, adminOnly, multiUpload, updateTemplate)

module.exports = router