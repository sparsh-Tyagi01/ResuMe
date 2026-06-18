const express = require("express")
const {connection} = require("./database/connection")
const dotenv = require("dotenv")
const bodyparser = require("body-parser")
const userRoutes = require("./routes/user")
const resumeRoutes = require("./routes/resume")
const templateRoutes = require("./routes/template")
const cors = require("cors")

dotenv.config()
const app = express()

connection(process.env.MONGO_URI)

const allowedOrigins = process.env.BASE_URL ? [
    process.env.BASE_URL.replace(/\/$/, "")
] : [];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            console.log(`CORS Blocked: Origin '${origin}' (normalized: '${normalizedOrigin}') is not in allowed list:`, allowedOrigins);
            callback(null, false);
        }
    },
    methods: "POST, GET, PUT, DELETE",
    credentials: true
}))

app.use(bodyparser.json())

app.use('/api/auth', userRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/template', templateRoutes)

app.listen(process.env.PORT, ()=>console.log(`Server started at PORT: ${process.env.PORT}`))