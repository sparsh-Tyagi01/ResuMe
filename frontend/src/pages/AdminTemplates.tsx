import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { axiosInstance } from "../lib/axios";
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Sliders, 
  Layers, 
  Palette, 
  FileText, 
  Check, 
  AlertCircle 
} from "lucide-react";
import toast from "react-hot-toast";

const FONT_OPTIONS = [
  "Plus Jakarta Sans",
  "EB Garamond",
  "Inter",
  "DM Sans",
  "Roboto",
  "Outfit",
];

const LAYOUT_OPTIONS = [
  { value: "single-column", label: "Single Column (Standard)" },
  { value: "two-column-left", label: "Two Column (Left Sidebar)" },
  { value: "two-column-right", label: "Two Column (Right Sidebar)" },
  { value: "top-header-block", label: "Top Header Banner Layout" },
  { value: "even-split", label: "Even Split (50-50 Columns)" },
  { value: "left-border-accent", label: "Left Vertical Border Accent" },
];

const SPACING_OPTIONS = [
  { value: "tight", label: "Tight Density" },
  { value: "normal", label: "Normal Density" },
  { value: "loose", label: "Loose Spacing" },
];

const BORDER_OPTIONS = [
  { value: "none", label: "No Outer Border" },
  { value: "solid", label: "Solid Accent Line" },
  { value: "dashed", label: "Dashed Accent Line" },
];

const PRESET_COLORS = [
  "#1e3a8a", // Navy
  "#10b981", // Emerald
  "#ec4899", // Rose
  "#f59e0b", // Amber
  "#6366f1", // Indigo
  "#0f172a", // Slate
  "#b91c1c", // Crimson
  "#7c3aed", // Violet
];

interface Template {
  _id: string;
  id: string;
  name: string;
  description: string;
  isBuiltin: boolean;
  fontFamily: string;
  primaryColor: string;
  layoutType: 
    | "single-column" 
    | "two-column-left" 
    | "two-column-right" 
    | "top-header-block" 
    | "even-split" 
    | "left-border-accent";
  spacing: "tight" | "normal" | "loose";
  showDividers: boolean;
  borderStyle: "none" | "solid" | "dashed";
  sectionOrder: string[];
}

const AdminTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form states
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fontFamily, setFontFamily] = useState<string>("Plus Jakarta Sans");
  const [primaryColor, setPrimaryColor] = useState<string>("#1e3a8a");
  const [layoutType, setLayoutType] = useState<string>("single-column");
  const [spacing, setSpacing] = useState<string>("normal");
  const [showDividers, setShowDividers] = useState<boolean>(true);
  const [borderStyle, setBorderStyle] = useState<string>("none");
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "leadership",
  ]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/template");
      if (res.data && res.data.data) {
        setTemplates(res.data.data.filter((t: any) => t && t.id));
      }
    } catch (error) {
      console.error("Fetch templates error:", error);
      toast.error("Failed to fetch templates list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const newOrder = [...sectionOrder];
    if (direction === "up" && index > 0) {
      const temp = newOrder[index];
      newOrder[index] = newOrder[index - 1];
      newOrder[index - 1] = temp;
    } else if (direction === "down" && index < newOrder.length - 1) {
      const temp = newOrder[index];
      newOrder[index] = newOrder[index + 1];
      newOrder[index + 1] = temp;
    }
    setSectionOrder(newOrder);
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name) {
      toast.error("ID and Name fields are required.");
      return;
    }

    const normalizedId = id.toLowerCase().trim().replace(/\s+/g, "-");
    const builtins = ["jake-classic", "modern-blue", "minimal-clean", "elegant-two-column"];
    if (builtins.includes(normalizedId)) {
      toast.error("Template ID conflicts with a built-in layout.");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post("/template/create", {
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

      toast.success("Custom template created successfully!");
      // Reset form
      setId("");
      setName("");
      setDescription("");
      setFontFamily("Plus Jakarta Sans");
      setPrimaryColor("#1e3a8a");
      setLayoutType("single-column");
      setSpacing("normal");
      setBorderStyle("none");
      setShowDividers(true);
      setSectionOrder([
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "leadership",
      ]);
      
      // Refresh list
      fetchTemplates();
    } catch (error: any) {
      console.error("Create template error:", error);
      const msg = error.response?.data?.message || "Failed to create template.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm(`Are you sure you want to delete template: ${templateId}?`)) {
      try {
        await axiosInstance.delete(`/template/${templateId}`);
        toast.success("Template deleted successfully!");
        fetchTemplates();
      } catch (error: any) {
        console.error("Delete template error:", error);
        const msg = error.response?.data?.message || "Failed to delete template.";
        toast.error(msg);
      }
    }
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Templates Manager
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              Add, configure, and manage dynamic resume template layouts for end users.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Creator Form Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 shadow-xl shadow-slate-100/40 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Sliders size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Create Template Layout</h2>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Template ID (slug)
                  </label>
                  <input
                    type="text"
                    required
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl text-sm font-semibold transition text-slate-800"
                    placeholder="e.g. skyline-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl text-sm font-semibold transition text-slate-800"
                    placeholder="e.g. Skyline Bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-20 px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl text-sm font-semibold transition text-slate-800 resize-none"
                  placeholder="Summarize layout vibes and characteristics..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Typography Font
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl text-sm font-semibold transition text-slate-800"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Layout Orientation
                  </label>
                  <select
                    value={layoutType}
                    onChange={(e) => setLayoutType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl text-sm font-semibold transition text-slate-800"
                  >
                    {LAYOUT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Scheme Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Primary Accent Theme Color
                </label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2.5">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setPrimaryColor(color)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center cursor-pointer transition transform hover:scale-105 active:scale-95 shadow-sm"
                        style={{ backgroundColor: color }}
                      >
                        {primaryColor === color && (
                          <Check size={14} className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                        )}
                      </button>
                    ))}
                    <div className="relative w-8 h-8 rounded-full border border-slate-200 overflow-hidden cursor-pointer flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition shadow-sm">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        title="Pick custom color"
                      />
                      <Palette size={16} className="text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {primaryColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Content Margin Density
                  </label>
                  <select
                    value={spacing}
                    onChange={(e) => setSpacing(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl text-sm font-semibold transition text-slate-800"
                  >
                    {SPACING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Sheet Outline Style
                  </label>
                  <select
                    value={borderStyle}
                    onChange={(e) => setBorderStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-xl text-sm font-semibold transition text-slate-800"
                  >
                    {BORDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dividers Options */}
              <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2.5 border border-slate-200 rounded-xl">
                <input
                  type="checkbox"
                  id="showDividers"
                  checked={showDividers}
                  onChange={(e) => setShowDividers(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-white border-slate-300 cursor-pointer"
                />
                <label htmlFor="showDividers" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Display Line Dividers under Section Titles
                </label>
              </div>

              {/* Section Ordering (Interactive) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Dynamic Section Hierarchy Ordering
                </label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50">
                  {sectionOrder.map((section, idx) => (
                    <div 
                      key={section} 
                      className="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <span className="capitalize">{section}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSection(idx, "up")}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === sectionOrder.length - 1}
                          onClick={() => handleMoveSection(idx, "down")}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-blue-500/15 cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Sparkles className="animate-spin" size={16} />
                    Saving Configuration...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Register Custom Template
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List Panel (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <Layers size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Active Layout Catalog</h2>
              </div>
              <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1 rounded-full border border-slate-200/50 font-semibold">
                {templates.length} templates
              </span>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 border border-slate-200 border-dashed rounded-3xl bg-slate-100/40">
                <Sparkles size={24} className="animate-spin text-blue-500" />
                <p className="text-xs text-slate-400 font-semibold">Syncing templates schema...</p>
              </div>
            ) : templates.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-20 border border-slate-200 border-dashed rounded-3xl bg-slate-100/40">
                <AlertCircle size={24} className="text-slate-400" />
                <p className="text-xs text-slate-400 font-semibold">No layouts registered.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((tpl) => (
                  <div 
                    key={tpl.id} 
                    className="bg-white border border-slate-200 shadow-md shadow-slate-100/30 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition duration-300"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                          {tpl.name}
                        </h3>
                        {tpl.isBuiltin ? (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200/60">
                            Built-in
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal mb-4">
                        {tpl.description || "Dynamic template defined via parameters."}
                      </p>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] text-slate-500 border-t border-slate-100 pt-3 mb-4">
                        <div className="flex items-center gap-1.5">
                          <FileText size={12} className="text-slate-400" />
                          <span className="truncate text-slate-600">{tpl.fontFamily}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Palette size={12} className="text-slate-400" />
                          <span className="flex items-center gap-1">
                            <span 
                              className="inline-block w-2.5 h-2.5 rounded-full border border-slate-200" 
                              style={{ backgroundColor: tpl.primaryColor }}
                            />
                            <span className="font-mono text-slate-600">{tpl.primaryColor}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <Sliders size={12} className="text-slate-400" />
                          <span className="capitalize text-slate-600">{tpl.layoutType.replace(/-/g, " ")}</span>
                        </div>
                      </div>
                    </div>

                    {!tpl.isBuiltin && (
                      <button
                        onClick={() => handleDeleteTemplate(tpl.id)}
                        className="mt-2 w-full py-2 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Trash2 size={13} />
                        Delete Layout
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminTemplates;
