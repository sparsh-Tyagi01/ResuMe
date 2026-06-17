const express = require("express")
const router = express.Router()
const {userRegister, userLogin, verifyOtpHandler, resendOtp} = require("../controllers/user")

router.post("/register", userRegister)
router.post("/login", userLogin)
router.post("/verify-otp", verifyOtpHandler)
router.post("/resend-otp", resendOtp)

module.exports = router