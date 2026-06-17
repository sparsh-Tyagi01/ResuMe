const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    if (!authHeader) return res.status(403).send("token required")
    try {
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (error) {
        return res.status(401).send("invalid token")
    }
}

function adminOnly(req,res, next) {
    if(!req.user || req.user.role != "admin"){
        return res.status(400).json({message: "Admin access required"})
    }
    next()
}

module.exports = {verifyToken, adminOnly}