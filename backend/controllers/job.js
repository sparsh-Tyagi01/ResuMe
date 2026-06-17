const { Job } = require("../models/job");
const { Resume } = require("../models/resume");

async function createJob(req, res) {
  try {
    const { jobTitle, company, location, jobLink, status, note, resumeId } = req.body;
    const userId = req.user.id;

    if (resumeId) {
      const resume = await Resume.findOne({ _id: resumeId, userId });
      if (!resume) {
        return res.status(404).json({ message: "Invalid resume selected" });
      }
    }

    const data = await Job.create({
      userId,
      jobTitle,
      company,
      location: location || "Remote",
      jobLink,
      status: status || "Applied",
      note: note || "",
      resumeId: resumeId || null,
    });

    return res.status(200).json({ message: "Job created successfully", data });
  } catch (error) {
    console.error("Create job error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getMyJob(req, res) {
  try {
    const userId = req.user.id;
    const data = await Job.find({ userId })
      .populate("resumeId", "title")
      .sort({ createdAt: -1 });
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Get my job error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getJobById(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const data = await Job.findOne({ _id: id, userId }).populate("resumeId");
    if (!data) {
      return res.status(404).json({ message: "No job found" });
    }
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Get job by id error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function deleteJob(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const data = await Job.findOneAndDelete({ _id: id, userId });
    if (!data) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function updateJobStatusHandler(req, res) {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const { status } = req.body;
    const data = await Job.findOneAndUpdate({ _id: id, userId }, { status }, { new: true });

    if (!data) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json({ message: "Updated Successfully", data });
  } catch (error) {
    console.error("Update job status error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createJob,
  getMyJob,
  getJobById,
  deleteJob,
  updateJobStatusHandler,
};