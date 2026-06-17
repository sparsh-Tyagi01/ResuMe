const { Resume } = require("../models/resume");
const crypto = require("crypto");

async function createResume(req, res) {
  try {
    const userId = req.user.id;
    const { title, templateId } = req.body;

    const data = await Resume.create({
      userId,
      title: title || "Untitled Resume",
      templateId: templateId || "jake-classic",
      personalInfo: { name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "" },
      skills: { languages: [], frameworks: [], tools: [], other: [] },
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      leadership: [],
    });

    return res.status(201).json({ message: "Resume created successfully", data });
  } catch (error) {
    console.error("Create resume error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getMyResumes(req, res) {
  try {
    const userId = req.user.id;
    const data = await Resume.find({ userId }).sort({ updatedAt: -1 });
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Get my resumes error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getResumeById(req, res) {
  try {
    const userId = req.user.id;
    const data = await Resume.findOne({ _id: req.params.id, userId });

    if (!data) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error("Get resume by id error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function updateResume(req, res) {
  try {
    const userId = req.user.id;
    const data = await Resume.findOne({ _id: req.params.id, userId });

    if (!data) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const fields = [
      "title",
      "templateId",
      "colorAccent",
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "leadership",
      "isPublic",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });

    const updated = await data.save();
    return res.status(200).json({ message: "Resume updated successfully", data: updated });
  } catch (error) {
    console.error("Update resume error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function deleteResume(req, res) {
  try {
    const userId = req.user.id;
    const data = await Resume.findOneAndDelete({ _id: req.params.id, userId });

    if (!data) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function duplicateResume(req, res) {
  try {
    const userId = req.user.id;
    const original = await Resume.findOne({ _id: req.params.id, userId });

    if (!original) {
      return res.status(404).json({ message: "Original resume not found" });
    }

    const copyData = original.toObject();
    delete copyData._id;
    delete copyData.createdAt;
    delete copyData.updatedAt;
    copyData.title = `${copyData.title} (Copy)`;
    copyData.isPublic = false;
    copyData.shareToken = undefined;

    const copy = await Resume.create(copyData);
    return res.status(201).json({ message: "Resume duplicated successfully", data: copy });
  } catch (error) {
    console.error("Duplicate resume error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function shareResume(req, res) {
  try {
    const userId = req.user.id;
    const data = await Resume.findOne({ _id: req.params.id, userId });

    if (!data) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const { isPublic } = req.body;
    data.isPublic = isPublic;

    if (isPublic && !data.shareToken) {
      data.shareToken = crypto.randomBytes(16).toString("hex");
    } else if (!isPublic) {
      data.shareToken = undefined;
    }

    await data.save();
    return res.status(200).json({
      message: isPublic ? "Resume is now public" : "Resume is now private",
      isPublic: data.isPublic,
      shareToken: data.shareToken,
    });
  } catch (error) {
    console.error("Share resume error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getSharedResume(req, res) {
  try {
    const data = await Resume.findOne({ shareToken: req.params.token, isPublic: true });

    if (!data) {
      return res.status(404).json({ message: "Shared resume not found or is private" });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error("Get shared resume error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
  shareResume,
  getSharedResume,
};