const express = require("express")
const router = express.Router()
const {userRegister, userLogin, verifyOtpHandler} = require("../controllers/user")

router.post("/register", userRegister)
router.post("/login", userLogin)
router.post("/verifyotp", verifyOtpHandler)

module.exports = router