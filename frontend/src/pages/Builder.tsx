import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import LayoutRenderer from "../components/templates/LayoutRenderer";
import { axiosInstance } from "../lib/axios";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  ChevronLeft,
  Save,
  Printer,
  Sliders,
  Award,
  BookOpen,
  Briefcase,
  FolderDot,
  GraduationCap,
  Hammer,
  User,
  Wand2,
} from "lucide-react";
import toast from "react-hot-toast";

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeResume, loadResume, createResume, updateResumeData, saveResume, loading, saving } = useResume();

  const [activeSection, setActiveSection] = useState<string>("personal");
  const [zoom, setZoom] = useState<number>(0.75);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const [prevId, setPrevId] = useState<string | undefined>(undefined);
  const [skillsText, setSkillsText] = useState({
    languages: "",
    frameworks: "",
    tools: "",
    other: "",
  });

  useEffect(() => {
    if (activeResume?.skills) {
      const currentLanguages = activeResume.skills.languages?.join(", ") || "";
      const currentFrameworks = activeResume.skills.frameworks?.join(", ") || "";
      const currentTools = activeResume.skills.tools?.join(", ") || "";
      const currentOther = activeResume.skills.other?.join(", ") || "";

      const parseList = (str: string) => str.split(",").map((s) => s.trim()).filter(Boolean);
      const languagesMatch = parseList(skillsText.languages).join(",") === activeResume.skills.languages?.join(",");
      const frameworksMatch = parseList(skillsText.frameworks).join(",") === activeResume.skills.frameworks?.join(",");
      const toolsMatch = parseList(skillsText.tools).join(",") === activeResume.skills.tools?.join(",");
      const otherMatch = parseList(skillsText.other).join(",") === activeResume.skills.other?.join(",");

      if (!languagesMatch || !frameworksMatch || !toolsMatch || !otherMatch || activeResume._id !== prevId) {
        setPrevId(activeResume._id);
        setSkillsText({
          languages: currentLanguages,
          frameworks: currentFrameworks,
          tools: currentTools,
          other: currentOther,
        });
      }
    }
  }, [activeResume, prevId, skillsText.languages, skillsText.frameworks, skillsText.tools, skillsText.other]);

  const [projectTechStackTexts, setProjectTechStackTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activeResume?.projects) {
      setProjectTechStackTexts((prev) => {
        const newTexts = { ...prev };
        let changed = false;
        
        activeResume.projects.forEach((proj) => {
          const currentVal = proj.techStack?.join(", ") || "";
          const localVal = prev[proj.id];
          
          const parseList = (str: string) => (str || "").split(",").map((s) => s.trim()).filter(Boolean);
          const match = localVal !== undefined && parseList(localVal).join(",") === proj.techStack?.join(",");
          
          if (!match) {
            newTexts[proj.id] = currentVal;
            changed = true;
          }
        });
        
        const currentIds = new Set(activeResume.projects.map(p => p.id));
        Object.keys(newTexts).forEach(id => {
          if (!currentIds.has(id)) {
            delete newTexts[id];
            changed = true;
          }
        });
        
        return changed ? newTexts : prev;
      });
    }
  }, [activeResume?.projects]);

  // Auto-creation of draft if navigated directly to /builder without an ID
  useEffect(() => {
    if (!id) {
      const initDraft = async () => {
        const savedTplId = localStorage.getItem("selectedTemplateId") || "jake-classic";
        localStorage.removeItem("selectedTemplateId");
        const doc = await createResume("My Resume Draft", savedTplId);
        if (doc && doc._id) {
          navigate(`/builder/${doc._id}`, { replace: true });
        }
      };
      initDraft();
    } else {
      loadResume(id);
    }
  }, [id, loadResume, createResume, navigate]);

  if (loading || !activeResume) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-500 font-sans">
        <Sparkles size={32} className="animate-spin text-blue-600" />
        <p className="text-sm font-semibold">Loading resume workspace...</p>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
  };

  // Safe field updates
  const updatePersonalInfo = (field: string, val: string) => {
    updateResumeData({
      personalInfo: {
        ...activeResume.personalInfo,
        [field]: val,
      },
    });
  };

  const updateSkills = (category: "languages" | "frameworks" | "tools" | "other", text: string) => {
    setSkillsText((prev) => ({ ...prev, [category]: text }));
    const arr = text.split(",").map((s) => s.trim()).filter(Boolean);
    updateResumeData({
      skills: {
        ...activeResume.skills,
        [category]: arr,
      },
    });
  };

  // AI Generation Handlers
  const handleGenerateSummary = async () => {
    if (!activeResume.personalInfo.title) {
      toast.error("Please add a Professional Title first to help the AI.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await axiosInstance.post("/ai/suggest", {
        type: "summary",
        name: activeResume.personalInfo.name,
        title: activeResume.personalInfo.title,
        skills: [
          ...activeResume.skills.languages,
          ...activeResume.skills.frameworks,
          ...activeResume.skills.tools,
        ],
      });
      if (res.status === 200 && res.data.text) {
        updateResumeData({ summary: res.data.text });
        toast.success("Summary generated!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI summary.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleRefineBullet = async (sectionType: "experience" | "projects" | "leadership", index: number, bulletIdx: number, currentText: string) => {
    if (!currentText) {
      toast.error("Please enter some details first to refine.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await axiosInstance.post("/ai/suggest", {
        type: "bullet",
        title: activeResume.personalInfo.title || "Professional",
        context: currentText,
      });

      if (res.status === 200 && res.data.text) {
        if (sectionType === "experience") {
          const list = [...activeResume.experience];
          list[index].bullets[bulletIdx] = res.data.text;
          updateResumeData({ experience: list });
        } else if (sectionType === "projects") {
          const list = [...activeResume.projects];
          list[index].bullets[bulletIdx] = res.data.text;
          updateResumeData({ projects: list });
        } else if (sectionType === "leadership") {
          const list = [...activeResume.leadership!];
          list[index].bullets[bulletIdx] = res.data.text;
          updateResumeData({ leadership: list });
        }
        toast.success("Bullet point refined!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to refine bullet point.");
    } finally {
      setAiLoading(false);
    }
  };

  // Repeatable list builders
  const addExperience = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      bullets: [""],
    };
    updateResumeData({ experience: [...activeResume.experience, newItem] });
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const list = [...activeResume.experience];
    list[index] = { ...list[index], [field]: value };
    updateResumeData({ experience: list });
  };

  const deleteExperience = (index: number) => {
    const list = activeResume.experience.filter((_, i) => i !== index);
    updateResumeData({ experience: list });
  };

  const addEducation = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      gpa: "",
      coursework: [],
    };
    updateResumeData({ education: [...activeResume.education, newItem] });
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const list = [...activeResume.education];
    list[index] = { ...list[index], [field]: value };
    updateResumeData({ education: list });
  };

  const deleteEducation = (index: number) => {
    const list = activeResume.education.filter((_, i) => i !== index);
    updateResumeData({ education: list });
  };

  const addProject = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      techStack: [],
      date: "",
      githubUrl: "",
      liveUrl: "",
      bullets: [""],
    };
    updateResumeData({ projects: [...activeResume.projects, newItem] });
  };

  const updateProject = (index: number, field: string, value: any) => {
    const list = [...activeResume.projects];
    list[index] = { ...list[index], [field]: value };
    updateResumeData({ projects: list });
  };

  const deleteProject = (index: number) => {
    const list = activeResume.projects.filter((_, i) => i !== index);
    updateResumeData({ projects: list });
  };

  const addCert = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    updateResumeData({ certifications: [...(activeResume.certifications || []), newItem] });
  };

  const updateCert = (index: number, field: string, value: any) => {
    const list = [...(activeResume.certifications || [])];
    list[index] = { ...list[index], [field]: value };
    updateResumeData({ certifications: list });
  };

  const deleteCert = (index: number) => {
    const list = (activeResume.certifications || []).filter((_, i) => i !== index);
    updateResumeData({ certifications: list });
  };

  const addLeadership = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      role: "",
      organization: "",
      duration: "",
      bullets: [""],
    };
    updateResumeData({ leadership: [...(activeResume.leadership || []), newItem] });
  };

  const updateLeadership = (index: number, field: string, value: any) => {
    const list = [...(activeResume.leadership || [])];
    list[index] = { ...list[index], [field]: value };
    updateResumeData({ leadership: list });
  };

  const deleteLeadership = (index: number) => {
    const list = (activeResume.leadership || []).filter((_, i) => i !== index);
    updateResumeData({ leadership: list });
  };

  // PDF Export Trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-screen bg-slate-50 flex flex-col font-sans select-none overflow-hidden no-print">
      {/* Mini Workspace Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors text-xs font-bold"
          >
            <ChevronLeft size={16} /> Dashboard
          </Link>
          <span className="text-slate-300">|</span>
          <input
            type="text"
            value={activeResume.title}
            onChange={(e) => updateResumeData({ title: e.target.value })}
            className="text-sm font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 focus:outline-none px-1.5 py-0.5"
            placeholder="Rename draft..."
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Template Select */}
          <select
            value={activeResume.templateId}
            onChange={(e) => updateResumeData({ templateId: e.target.value })}
            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="jake-classic">Jake's Classic LaTeX</option>
            <option value="modern-blue">Modern Navy Sidebar</option>
            <option value="minimal-clean">Minimal Single Column</option>
            <option value="elegant-two-column">Elegant Split Grid</option>
          </select>

          {/* Color Accent choice (only shows for templates that use it) */}
          {activeResume.templateId !== "jake-classic" && (
            <input
              type="color"
              value={activeResume.colorAccent || "#2563EB"}
              onChange={(e) => updateResumeData({ colorAccent: e.target.value })}
              className="w-8 h-8 rounded-full border border-slate-200 p-0.5 cursor-pointer"
              title="Pick color accent"
            />
          )}

          <button
            onClick={saveResume}
            disabled={saving}
            className="px-4 py-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save size={14} /> {saving ? "Saving..." : "Save Now"}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
          >
            <Printer size={14} /> Export PDF
          </button>
        </div>
      </header>

      {/* Editor Main Grid */}
      <div className="flex-1 w-full flex overflow-hidden">
        {/* Left Form Input Panel (45%) */}
        <aside className="w-[45%] h-full border-r border-slate-200 bg-white overflow-y-auto p-6 space-y-4">
          <h2 className="text-base font-extrabold text-slate-950 mb-4 tracking-tight flex items-center gap-1.5">
            <Sliders size={18} className="text-blue-600" />
            Resume Details
          </h2>

          {/* Collapsible Section: Personal Info */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("personal")}
              className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between border-b border-slate-100 cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <User size={16} className="text-slate-500" /> Personal Information
              </span>
              {activeSection === "personal" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeSection === "personal" && (
              <div className="p-5 grid grid-cols-2 gap-4 text-left">
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo.name}
                    onChange={(e) => updatePersonalInfo("name", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Professional Title</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo.title}
                    onChange={(e) => updatePersonalInfo("title", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <input
                    type="email"
                    value={activeResume.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location (City, State)</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo.location}
                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">LinkedIn URL</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GitHub URL</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo.github}
                    onChange={(e) => updatePersonalInfo("github", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="github.com/username"
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Portfolio / Website</label>
                  <input
                    type="text"
                    value={activeResume.personalInfo.portfolio}
                    onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="username.dev"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section: Summary */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("summary")}
              className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between border-b border-slate-100 cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <BookOpen size={16} className="text-slate-500" /> Summary
              </span>
              {activeSection === "summary" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeSection === "summary" && (
              <div className="p-5 flex flex-col gap-3 text-left">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Professional Summary</label>
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={aiLoading}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Wand2 size={12} /> {aiLoading ? "Generating..." : "AI Suggest"}
                  </button>
                </div>
                <textarea
                  value={activeResume.summary || ""}
                  onChange={(e) => updateResumeData({ summary: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs leading-relaxed"
                  placeholder="Summarize your professional experience in 2-4 lines..."
                />
              </div>
            )}
          </div>

          {/* Collapsible Section: Experience */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("experience")}
              className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between border-b border-slate-100 cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Briefcase size={16} className="text-slate-500" /> Experience
              </span>
              {activeSection === "experience" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeSection === "experience" && (
              <div className="p-5 space-y-6 text-left">
                {activeResume.experience.map((exp, idx) => (
                  <div key={exp.id} className="border border-slate-100 p-4 rounded-2xl relative bg-slate-50/30">
                    <button
                      onClick={() => deleteExperience(idx)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>

                    <h4 className="text-xs font-bold text-slate-900 uppercase mb-4">Job #{idx + 1}</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Company Name</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, "company", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="Stripe"
                        />
                      </div>
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Role / Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, "role", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="Frontend Engineer"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(idx, "startDate", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="Jun 2023"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">End Date</label>
                        <input
                          type="text"
                          disabled={exp.current}
                          value={exp.current ? "Present" : exp.endDate}
                          onChange={(e) => updateExperience(idx, "endDate", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs disabled:opacity-60"
                          placeholder="Present"
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`curr-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(idx, "current", e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor={`curr-${exp.id}`} className="text-xs font-semibold text-slate-600">
                          Currently work here
                        </label>
                      </div>
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(idx, "location", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="San Francisco, CA"
                        />
                      </div>

                      {/* Bullets editing */}
                      <div className="flex flex-col gap-2 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Description Bullet Points
                        </label>
                        {exp.bullets.map((bullet, bulletIdx) => (
                          <div key={bulletIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => {
                                const bCopy = [...exp.bullets];
                                bCopy[bulletIdx] = e.target.value;
                                updateExperience(idx, "bullets", bCopy);
                              }}
                              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                              placeholder="Describe your achievement..."
                            />
                            <button
                              type="button"
                              onClick={() => handleRefineBullet("experience", idx, bulletIdx, bullet)}
                              disabled={aiLoading}
                              className="p-1.5 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 cursor-pointer disabled:opacity-50"
                              title="Refine with Gemini AI"
                            >
                              <Wand2 size={13} />
                            </button>
                            {exp.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const bCopy = exp.bullets.filter((_, bi) => bi !== bulletIdx);
                                  updateExperience(idx, "bullets", bCopy);
                                }}
                                className="text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            updateExperience(idx, "bullets", [...exp.bullets, ""]);
                          }}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 mt-1 cursor-pointer"
                        >
                          <Plus size={12} /> Add bullet point
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addExperience}
                  className="w-full py-3 border border-dashed border-slate-300 hover:border-slate-400 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add Experience Block
                </button>
              </div>
            )}
          </div>

          {/* Collapsible Section: Education */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("education")}
              className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between border-b border-slate-100 cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap size={16} className="text-slate-500" /> Education
              </span>
              {activeSection === "education" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeSection === "education" && (
              <div className="p-5 space-y-6 text-left">
                {activeResume.education.map((edu, idx) => (
                  <div key={edu.id} className="border border-slate-100 p-4 rounded-2xl relative bg-slate-50/30">
                    <button
                      onClick={() => deleteEducation(idx)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>

                    <h4 className="text-xs font-bold text-slate-900 uppercase mb-4">Education #{idx + 1}</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="Stanford University"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="Bachelor of Science"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(idx, "field", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="Computer Science"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Start Year</label>
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => updateEducation(idx, "startYear", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="2019"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">End Year</label>
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => updateEducation(idx, "endYear", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="2023"
                        />
                      </div>
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GPA (Optional)</label>
                        <input
                          type="text"
                          value={edu.gpa || ""}
                          onChange={(e) => updateEducation(idx, "gpa", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="3.9"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addEducation}
                  className="w-full py-3 border border-dashed border-slate-300 hover:border-slate-400 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add Education Block
                </button>
              </div>
            )}
          </div>

          {/* Collapsible Section: Skills */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("skills")}
              className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between border-b border-slate-100 cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Hammer size={16} className="text-slate-500" /> Skills
              </span>
              {activeSection === "skills" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeSection === "skills" && (
              <div className="p-5 space-y-4 text-left">
                <p className="text-[10px] text-slate-400 font-semibold mb-2 italic">
                  * Input skills as comma-separated tags (e.g. React, Next.js, Go)
                </p>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Languages</label>
                  <input
                    type="text"
                    value={skillsText.languages}
                    onChange={(e) => updateSkills("languages", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="TypeScript, Python, Go"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Frameworks</label>
                  <input
                    type="text"
                    value={skillsText.frameworks}
                    onChange={(e) => updateSkills("frameworks", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="React, Next.js, Express"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tools</label>
                  <input
                    type="text"
                    value={skillsText.tools}
                    onChange={(e) => updateSkills("tools", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="Docker, Git, AWS"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Other Skills</label>
                  <input
                    type="text"
                    value={skillsText.other}
                    onChange={(e) => updateSkills("other", e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                    placeholder="System Design, ATS Optimization"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section: Projects */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("projects")}
              className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between border-b border-slate-100 cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <FolderDot size={16} className="text-slate-500" /> Projects
              </span>
              {activeSection === "projects" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeSection === "projects" && (
              <div className="p-5 space-y-6 text-left">
                {activeResume.projects.map((proj, idx) => (
                  <div key={proj.id} className="border border-slate-100 p-4 rounded-2xl relative bg-slate-50/30">
                    <button
                      onClick={() => deleteProject(idx)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>

                    <h4 className="text-xs font-bold text-slate-900 uppercase mb-4">Project #{idx + 1}</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Project Name</label>
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => updateProject(idx, "name", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="LaTeX Live Builder"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tech Stack (comma-separated)</label>
                        <input
                          type="text"
                          value={projectTechStackTexts[proj.id] || ""}
                          onChange={(e) => {
                            const text = e.target.value;
                            setProjectTechStackTexts((prev) => ({ ...prev, [proj.id]: text }));
                            const arr = text.split(",").map((s) => s.trim()).filter(Boolean);
                            updateProject(idx, "techStack", arr);
                          }}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="React, Express, Go"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date / Duration</label>
                        <input
                          type="text"
                          value={proj.date}
                          onChange={(e) => updateProject(idx, "date", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="Jan 2024"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">GitHub URL</label>
                        <input
                          type="text"
                          value={proj.githubUrl}
                          onChange={(e) => updateProject(idx, "githubUrl", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="github.com/username/project"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live URL</label>
                        <input
                          type="text"
                          value={proj.liveUrl}
                          onChange={(e) => updateProject(idx, "liveUrl", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="project.dev"
                        />
                      </div>

                      {/* Project bullets */}
                      <div className="flex flex-col gap-2 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Description Bullet Points
                        </label>
                        {proj.bullets.map((bullet, bulletIdx) => (
                          <div key={bulletIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => {
                                const bCopy = [...proj.bullets];
                                bCopy[bulletIdx] = e.target.value;
                                updateProject(idx, "bullets", bCopy);
                              }}
                              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                              placeholder="Describe project details..."
                            />
                            <button
                              type="button"
                              onClick={() => handleRefineBullet("projects", idx, bulletIdx, bullet)}
                              disabled={aiLoading}
                              className="p-1.5 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 cursor-pointer disabled:opacity-50"
                              title="Refine with Gemini AI"
                            >
                              <Wand2 size={13} />
                            </button>
                            {proj.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const bCopy = proj.bullets.filter((_, bi) => bi !== bulletIdx);
                                  updateProject(idx, "bullets", bCopy);
                                }}
                                className="text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            updateProject(idx, "bullets", [...proj.bullets, ""]);
                          }}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 mt-1 cursor-pointer"
                        >
                          <Plus size={12} /> Add bullet point
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addProject}
                  className="w-full py-3 border border-dashed border-slate-300 hover:border-slate-400 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add Project Block
                </button>
              </div>
            )}
          </div>

          {/* Collapsible Section: Certifications */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("certs")}
              className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between border-b border-slate-100 cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Award size={16} className="text-slate-500" /> Certifications
              </span>
              {activeSection === "certs" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeSection === "certs" && (
              <div className="p-5 space-y-6 text-left">
                {(activeResume.certifications || []).map((cert, idx) => (
                  <div key={cert.id} className="border border-slate-100 p-4 rounded-2xl relative bg-slate-50/30">
                    <button
                      onClick={() => deleteCert(idx)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>

                    <h4 className="text-xs font-bold text-slate-900 uppercase mb-4">Cert #{idx + 1}</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Certification Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCert(idx, "name", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="AWS Solutions Architect"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Issuer</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCert(idx, "issuer", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="Amazon Web Services"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date Issued</label>
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => updateCert(idx, "date", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="2024"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCert}
                  className="w-full py-3 border border-dashed border-slate-300 hover:border-slate-400 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add Certification
                </button>
              </div>
            )}
          </div>

          {/* Collapsible Section: Leadership */}
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleSection("leadership")}
              className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between border-b border-slate-100 cursor-pointer"
            >
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Sparkles size={16} className="text-slate-500" /> Leadership & Extracurriculars
              </span>
              {activeSection === "leadership" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeSection === "leadership" && (
              <div className="p-5 space-y-6 text-left">
                {(activeResume.leadership || []).map((lead, idx) => (
                  <div key={lead.id} className="border border-slate-100 p-4 rounded-2xl relative bg-slate-50/30">
                    <button
                      onClick={() => deleteLeadership(idx)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>

                    <h4 className="text-xs font-bold text-slate-900 uppercase mb-4">Leadership #{idx + 1}</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Role / Title</label>
                        <input
                          type="text"
                          value={lead.role}
                          onChange={(e) => updateLeadership(idx, "role", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="Treasurer"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Organization</label>
                        <input
                          type="text"
                          value={lead.organization}
                          onChange={(e) => updateLeadership(idx, "organization", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="ACM Student Chapter"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Duration</label>
                        <input
                          type="text"
                          value={lead.duration}
                          onChange={(e) => updateLeadership(idx, "duration", e.target.value)}
                          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                          placeholder="2022 - 2023"
                        />
                      </div>

                      {/* Leadership bullets */}
                      <div className="flex flex-col gap-2 col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Description Bullet Points
                        </label>
                        {lead.bullets.map((bullet, bulletIdx) => (
                          <div key={bulletIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => {
                                const bCopy = [...lead.bullets];
                                bCopy[bulletIdx] = e.target.value;
                                updateLeadership(idx, "bullets", bCopy);
                              }}
                              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition-all text-xs"
                              placeholder="Describe activity details..."
                            />
                            <button
                              type="button"
                              onClick={() => handleRefineBullet("leadership", idx, bulletIdx, bullet)}
                              disabled={aiLoading}
                              className="p-1.5 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 cursor-pointer disabled:opacity-50"
                              title="Refine with Gemini AI"
                            >
                              <Wand2 size={13} />
                            </button>
                            {lead.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const bCopy = lead.bullets.filter((_, bi) => bi !== bulletIdx);
                                  updateLeadership(idx, "bullets", bCopy);
                                }}
                                className="text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            updateLeadership(idx, "bullets", [...lead.bullets, ""]);
                          }}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 mt-1 cursor-pointer"
                        >
                          <Plus size={12} /> Add bullet point
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addLeadership}
                  className="w-full py-3 border border-dashed border-slate-300 hover:border-slate-400 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add Leadership Entry
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Right Preview Panel (55%) */}
        <main className="w-[55%] h-full bg-slate-200/50 p-6 flex flex-col items-center justify-start overflow-auto relative">
          {/* Canvas Controls */}
          <div className="w-full max-w-[794px] flex items-center justify-between mb-4 bg-white/70 backdrop-blur-md px-4 py-2 border border-slate-200/50 rounded-xl shadow-xs sticky top-0 z-20">
            <span className="text-xs font-bold text-slate-500">Live Preview</span>
            <div className="flex items-center gap-4">
              {/* Zoom controls */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Zoom</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.2"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-24 cursor-pointer"
                />
                <span className="font-bold w-10 text-right">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Actual template rendering frame */}
          <div
            className="shadow-2xl rounded-sm border border-slate-300 transform origin-top-left transition-all duration-100 ease-out"
            style={{
              transform: `scale(${zoom})`,
              width: "794px",
              minHeight: "1123px",
              marginBottom: `${-1123 * (1 - zoom) + 40}px`,
              marginRight: `${-794 * (1 - zoom)}px`,
            }}
          >
            <LayoutRenderer templateId={activeResume.templateId} data={activeResume} />
          </div>
        </main>
      </div>

      {/* Styled vector print frame wrapper (hidden in screen mode) */}
      <div className="hidden print:block w-[794px] h-[1123px] bg-white text-black p-0 m-0">
        <LayoutRenderer templateId={activeResume.templateId} data={activeResume} />
      </div>
    </div>
  );
};

export default Builder;
