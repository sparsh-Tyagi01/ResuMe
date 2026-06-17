const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const templateSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    fontFamily: {
      type: String,
      default: "Plus Jakarta Sans",
    },
    primaryColor: {
      type: String,
      default: "#2563EB",
    },
    layoutType: {
      type: String,
      default: "single-column",
    },
    spacing: {
      type: String,
      default: "normal",
    },
    showDividers: {
      type: Boolean,
      default: true,
    },
    borderStyle: {
      type: String,
      default: "none",
    },
    sectionOrder: {
      type: [String],
      default: ["summary", "experience", "education", "skills", "projects", "certifications", "leadership"],
    },
  },
  { timestamps: true }
);

const Template = mongoose.model("Template", templateSchema);

module.exports = { Template };
