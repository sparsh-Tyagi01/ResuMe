const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const templateSchema = new Schema({
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
    default: "#1e3a8a",
  },
  layoutType: {
    type: String,
    enum: [
      "single-column",
      "two-column-left",
      "two-column-right",
      "top-header-block",
      "even-split",
      "left-border-accent"
    ],
    default: "single-column",
  },
  spacing: {
    type: String,
    enum: ["tight", "normal", "loose"],
    default: "normal",
  },
  showDividers: {
    type: Boolean,
    default: true,
  },
  borderStyle: {
    type: String,
    enum: ["none", "solid", "dashed"],
    default: "none",
  },
  sectionOrder: {
    type: [String],
    default: [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "leadership",
    ],
  },
}, { timestamps: true });

const Template = mongoose.model("Template", templateSchema);

module.exports = { Template };
