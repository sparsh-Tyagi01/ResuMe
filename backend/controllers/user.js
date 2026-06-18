const { User } = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")

dotenv.config()

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

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
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function userLogin(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ "message": "Invalid Email address" });
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ "message": "Invalid password" })
  }
  const payload = {
    id: user._id,
    email: user.email,
    role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
  }
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
  return res.status(200).json({ "message": "Login successful", token, payload })
}

module.exports = { userRegister, userLogin }