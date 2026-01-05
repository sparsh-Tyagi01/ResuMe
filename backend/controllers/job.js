const {Job} = require("../models/job")
const { Resume } = require("../models/resume")

async function createJob(req,res) {
    const {jobTitle, company, location, jobLink, status, note, resumeId} = req.body
    const userId = req.user.id

    const resume = await Resume.findOne({_id: resumeId, userId})
    if(!resume){
        return res.status(404).json({message: "Invalid resume selected"})
    }

    const data = await Job.create({
        userId, jobTitle, company, location, jobLink, status, note, resumeId
    })

    return res.status(200).json({message: "Job created successfully", data})
}

async function getMyJob(req,res) {
    const userId = req.user.id
    const data = await Job.find({userId}).populate("resumeId", "name resumeUrl").sort({createdAt: -1})
    if(!data){
        return res.status(404).json({message: "No job found"})
    }
    return res.status(200).json({data})
}

async function getJobById(req,res) {
    const id = req.params.id
    const userId = req.user.id
    const data = await Job.findOne({_id: id, userId}).populate("resumeId").sort({createdAt: -1})
    if(!data){
        return res.status(404).json({message: "No job found"})
    }
    return res.status(200).json({data})
}

async function deleteJob(req,res) {
    const id = req.params.id
    const userId = req.user.id
    const data = await Job.findByIdAndDelete({_id: id, userId})
    if (!data) {
      return res.status(404).json({ message: "Job not found or not authorized" })
    }

    return res.status(200).json({ message: "Job deleted successfully" })
}

async function updateJobStatusHandler(req,res) {
    const id = req.params.id
    const userId = req.user.id
    const { status } = req.body
    const data = await Job.findByIdAndUpdate({_id: id, userId}, status)

    if(!data){
        return res.status(404).json({message: "Job not found"})
    }
    return res.status(200).json({message: "Updated Successfully"})
}

module.exports = {createJob, getMyJob, getJobById, deleteJob, updateJobStatusHandler}