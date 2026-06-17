const express = require("express")
const {connection} = require("./database/connection")
const dotenv = require("dotenv")
const bodyparser = require("body-parser")
const userRoutes = require("./routes/user")
const resumeRoutes = require("./routes/resume")
const jobRoutes = require("./routes/job")
const cors = require("cors")
const aiRoutes = require("./routes/ai")

dotenv.config()
const app = express()

connection(process.env.MONGO_URI)

app.use(cors({
    origin: process.env.BASE_URL,
    methods: "POST, GET, PUT, DELETE",
    credentials: true
}))

app.use(bodyparser.json())

app.use('/api/auth', userRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/job', jobRoutes)
app.use('/api/ai', aiRoutes)

app.listen(process.env.PORT, ()=>console.log(`Server started at PORT: ${process.env.PORT}`))