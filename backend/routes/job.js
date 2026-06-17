const express = require("express")
const router = express.Router()
const {verifyToken} = require("../middlewares/auth")
const {createJob, getMyJob, getJobById, deleteJob, updateJobStatusHandler} = require("../controllers/job")

router.post("/create", verifyToken, createJob)
router.get("/my", verifyToken, getMyJob)
router.get("/:id", verifyToken, getJobById)
router.delete("/:id", verifyToken, deleteJob)
router.put('/:id', verifyToken, updateJobStatusHandler)

module.exports = router