const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const resumeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "Untitled Resume",
    },
    templateId: {
      type: String,
      required: true,
      default: "jake-classic",
    },
    colorAccent: {
      type: String,
      default: "#2563EB",
    },
    personalInfo: {
      name: { type: String, default: "" },
      title: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    summary: { type: String, default: "" },
    experience: [
      {
        company: { type: String, default: "" },
        role: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        current: { type: Boolean, default: false },
        location: { type: String, default: "" },
        bullets: { type: [String], default: [] },
      },
    ],
    education: [
      {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        field: { type: String, default: "" },
        startYear: { type: String, default: "" },
        endYear: { type: String, default: "" },
        gpa: { type: String, default: "" },
        coursework: { type: [String], default: [] },
      },
    ],
    skills: {
      languages: { type: [String], default: [] },
      frameworks: { type: [String], default: [] },
      tools: { type: [String], default: [] },
      other: { type: [String], default: [] },
    },
    projects: [
      {
        name: { type: String, default: "" },
        techStack: { type: [String], default: [] },
        date: { type: String, default: "" },
        githubUrl: { type: String, default: "" },
        liveUrl: { type: String, default: "" },
        bullets: { type: [String], default: [] },
      },
    ],
    certifications: [
      {
        name: { type: String, default: "" },
        issuer: { type: String, default: "" },
        date: { type: String, default: "" },
        url: { type: String, default: "" },
      },
    ],
    leadership: [
      {
        role: { type: String, default: "" },
        organization: { type: String, default: "" },
        duration: { type: String, default: "" },
        bullets: { type: [String], default: [] },
      },
    ],
    isPublic: { type: Boolean, default: false },
    shareToken: { type: String },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = { Resume };