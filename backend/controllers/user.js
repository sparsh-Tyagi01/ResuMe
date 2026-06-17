const {User} = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
const transporter = require("../config/mailer")

dotenv.config()

const generateOTP = ()=>Math.floor(100000 + Math.random() * 900000).toString()

async function userRegister(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(409).json({ message: "Phone already registered" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedOtp = await bcrypt.hash(otp, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpires,
    });

    await transporter.sendMail({
      from: `"Smart Resume AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}


async function verifyOtpHandler(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const payload = {
      id: user._id,
      email: user.email,
      role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Registration successful",
      token,
      payload,
    });

  } catch (error) {
    console.error("OTP Verify Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}


async function userLogin(req,res) {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user) return res.status(400).json({"message": "Invalid Email address"});
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({"message": "Invalid password"})
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    return res.status(200).json({"message": "Login successful", token, payload})
}

async function resendOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    await transporter.sendMail({
      from: `"Flowtica" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Flowtica OTP Code",
      text: `Your new Flowtica verification code is ${otp}. It will expire in 5 minutes.`,
    });

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {userRegister, userLogin, verifyOtpHandler, resendOtp}