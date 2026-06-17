const { Template } = require("../models/template");

const staticTemplates = [
  {
    _id: "static-1",
    id: "jake-classic",
    name: "Jake's Classic",
    description: "Clean black-and-white serif layout, optimized for software and financial careers.",
    isBuiltin: true,
    fontFamily: "EB Garamond",
    primaryColor: "#000000",
    layoutType: "single-column",
    spacing: "normal",
    showDividers: true,
    borderStyle: "none",
  },
  {
    _id: "static-2",
    id: "modern-blue",
    name: "Modern Navy Sidebar",
    description: "Striking left sidebar highlighting contact coordinates and skills category tags.",
    isBuiltin: true,
    fontFamily: "Plus Jakarta Sans",
    primaryColor: "#1e3a8a",
    layoutType: "two-column-left",
    spacing: "normal",
    showDividers: true,
    borderStyle: "none",
  },
  {
    _id: "static-3",
    id: "minimal-clean",
    name: "Minimal Single Column",
    description: "Generous whitespace, thin dividers, and a modern custom-color layout.",
    isBuiltin: true,
    fontFamily: "Inter",
    primaryColor: "#0f172a",
    layoutType: "single-column",
    spacing: "normal",
    showDividers: true,
    borderStyle: "none",
  },
  {
    _id: "static-4",
    id: "elegant-two-column",
    name: "Elegant Split Grid",
    description: "Visual two-column layout with serif headers, balancing detail densities.",
    isBuiltin: true,
    fontFamily: "EB Garamond",
    primaryColor: "#475569",
    layoutType: "two-column-right",
    spacing: "normal",
    showDividers: true,
    borderStyle: "none",
  },
];

async function createTemplate(req, res) {
  try {
    const {
      id,
      name,
      description,
      fontFamily,
      primaryColor,
      layoutType,
      spacing,
      showDividers,
      borderStyle,
      sectionOrder,
    } = req.body;

    if (!id || !name) {
      return res.status(400).json({ message: "ID and Name are required" });
    }

    const normalizedId = id.toLowerCase().trim().replace(/\s+/g, "-");

    const builtins = ["jake-classic", "modern-blue", "minimal-clean", "elegant-two-column"];
    if (builtins.includes(normalizedId)) {
      return res.status(400).json({ message: "Template ID conflicts with built-in templates" });
    }

    const existing = await Template.findOne({ id: normalizedId });
    if (existing) {
      return res.status(400).json({ message: "Template ID already exists" });
    }

    const template = new Template({
      id: normalizedId,
      name,
      description,
      fontFamily,
      primaryColor,
      layoutType,
      spacing,
      showDividers,
      borderStyle,
      sectionOrder,
    });

    await template.save();
    return res.status(201).json({ message: "Template created successfully", data: template });
  } catch (error) {
    console.error("Create Template Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getTemplates(req, res) {
  try {
    const dbTemplates = await Template.find().sort({ createdAt: -1 });
    const formattedDb = dbTemplates.map((t) => ({
      ...t.toObject(),
      isBuiltin: false,
    }));
    return res.status(200).json({ data: [...staticTemplates, ...formattedDb] });
  } catch (error) {
    console.error("Get Templates Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function deleteTemplate(req, res) {
  try {
    const { id } = req.params;

    const builtins = ["jake-classic", "modern-blue", "minimal-clean", "elegant-two-column"];
    if (builtins.includes(id)) {
      return res.status(400).json({ message: "Cannot delete built-in templates" });
    }

    const template = await Template.findOneAndDelete({ id });
    if (!template) {
      return res.status(444).json({ message: "Template not found" });
    }

    return res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Delete Template Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createTemplate, getTemplates, deleteTemplate };
