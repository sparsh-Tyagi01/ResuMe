const {User} = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")

dotenv.config()

async function userRegister(req,res) {
    const {name,email,phone,password} = req.body
    const existingEmail = await User.findOne({email})
    if(existingEmail){
        return res.status(404).json({"message": "Email already register"})
    }
    const existingPhone = await User.findOne({phone})
    if(existingPhone){
        return res.status(404).json({"message": "Phone no. already register"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const data = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
    })
    let payload = {
        id: data._id,
        email: data.email
    }
    if(email === process.env.ADMIN_EMAIL){
        payload.role = "admin"
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    return res.status(200).json({"message": "Register Successful!", token, data})
}

async function userLogin(req,res) {
    const {email, password} = req.body
    const data = await User.findOne({email})
    if(!data) return res.status(400).json({"message": "Invalid Email address"});
    const isMatch = await bcrypt.compare(password,data.password)
    if(!isMatch){
        return res.status(400).json({"message": "Invalid password"})
    }
    let payload = {
        id: data._id,
        email: data.email
    }
    if(email === process.env.ADMIN_EMAIL){
        payload.role = "admin"
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    return res.status(200).json({"message": "Login successful", token, data})
}

module.exports = {userRegister, userLogin}