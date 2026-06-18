import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useResume } from "../context/ResumeContext";
import { Check, ArrowRight, Sparkles, Compass } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  category: "Professional" | "Academic" | "Creative" | "Minimal" | "Custom";
  accentColor: string;
  previewLayout: React.ReactNode;
}

const generateMiniPreview = (layoutType: string, primaryColor: string) => {
  if (layoutType === "two-column-left" || layoutType === "two-column-right") {
    const isLeft = layoutType === "two-column-left";
    const sidebar = (
      <div className="w-[30%] p-1.5 flex flex-col gap-1" style={{ backgroundColor: primaryColor }}>
        <div className="w-3.5 h-3.5 rounded-full bg-white/20 mx-auto" />
        <div className="h-0.5 bg-white/20 rounded w-2/3 mx-auto" />
        <div className="h-[2px] bg-white/10 rounded w-1/2 mx-auto" />
        <div className="mt-2 space-y-0.5">
          <div className="h-[2px] bg-white/15 rounded w-full" />
          <div className="h-[2px] bg-white/15 rounded w-4/5" />
          <div className="h-[2px] bg-white/15 rounded w-3/4" />
        </div>
      </div>
    );
    const main = (
      <div className="flex-1 p-2 flex flex-col gap-1 bg-white text-slate-800">
        <div className="h-0.5 bg-slate-200 rounded w-1/3" />
        <div className="space-y-0.5 mt-1">
          <div className="h-[2px] bg-slate-100 rounded w-full" />
          <div className="h-[2px] bg-slate-100 rounded w-full" />
          <div className="h-[2px] bg-slate-100 rounded w-2/3" />
        </div>
        <div className="h-0.5 bg-slate-200 rounded w-1/4 mt-1" />
        <div className="space-y-0.5">
          <div className="h-[2px] bg-slate-100 rounded w-full" />
          <div className="h-[2px] bg-slate-100 rounded w-3/4" />
        </div>
      </div>
    );
    return (
      <div className="w-full h-full bg-slate-50 flex select-none text-[5px] leading-none">
        {isLeft ? (
          <>
            {sidebar}
            {main}
          </>
        ) : (
          <>
            {main}
            {sidebar}
          </>
        )}
      </div>
    );
  }

  // Single Column Mini Layout
  return (
    <div className="w-full h-full bg-white flex flex-col p-2.5 text-[5px] leading-none select-none">
      <div className="text-center font-bold mb-0.5 h-1 rounded w-1/3 mx-auto" style={{ backgroundColor: primaryColor }} />
      <div className="h-[2px] bg-slate-100 rounded w-1/2 mx-auto mb-1.5" />
      <div className="w-full h-[0.5px] mb-1.5" style={{ backgroundColor: primaryColor }} />
      
      <div className="h-0.5 rounded w-1/4 mb-0.5" style={{ backgroundColor: primaryColor }} />
      <div className="space-y-0.5 mb-1.5">
        <div className="h-[2px] bg-slate-100 rounded w-full" />
        <div className="h-[2px] bg-slate-100 rounded w-5/6" />
      </div>
      
      <div className="h-0.5 rounded w-1/5 mb-0.5" style={{ backgroundColor: primaryColor }} />
      <div className="space-y-0.5">
        <div className="h-[2px] bg-slate-100 rounded w-full" />
        <div className="h-[2px] bg-slate-100 rounded w-4/5" />
      </div>
    </div>
  );
};

const Templates = () => {
  const navigate = useNavigate();
  const { createResume } = useResume();
  const [selectedId, setSelectedId] = useState<string>("jake-classic");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const defaultTemplates: TemplateInfo[] = [
    {
      id: "jake-classic",
      name: "Jake's Classic",
      description: "Standard academic and software engineering layout with EB Garamond serif font and piping dividers.",
      category: "Academic",
      accentColor: "#1E293B",
      previewLayout: (
        <div className="w-full h-full bg-white flex flex-col p-4 text-[7px] text-slate-800 font-serif leading-none select-none">
          <div className="text-center font-bold text-[10px] mb-1">JAKE DOE</div>
          <div className="text-center text-slate-500 mb-2 border-b border-slate-300 pb-1 flex justify-center gap-1.5">
            <span>jake@doe.com</span>•<span>linkedin/jake</span>•<span>github.com/jake</span>
          </div>
          <div className="font-bold text-[7px] border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-wider text-left">Education</div>
          <div className="flex justify-between font-bold mb-0.5">
            <span>Stanford University</span>
            <span>2019 – 2023</span>
          </div>
          <div className="text-slate-500 italic mb-2 text-left">B.S. in Computer Science</div>
          <div className="font-bold text-[7px] border-b border-slate-300 pb-0.5 mb-1.5 uppercase tracking-wider text-left">Experience</div>
          <div className="flex justify-between font-bold mb-0.5">
            <span>Stripe — Frontend Developer</span>
            <span>2023 – Present</span>
          </div>
          <div className="text-slate-500 mb-1 text-left">• Led UI overhaul resulting in 15% conversion lift.</div>
          <div className="text-slate-500 text-left">• Developed reusable React component catalog.</div>
        </div>
      ),
    },
    {
      id: "modern-blue",
      name: "Modern Sidebar (Navy)",
      description: "A professional layout with a left sidebar for quick-glance skills, accent color customization, and contact detail icons.",
      category: "Professional",
      accentColor: "#2563EB",
      previewLayout: (
        <div className="w-full h-full bg-white flex select-none text-[6px] text-slate-700 leading-none">
          <div className="w-1/3 bg-slate-900 text-white p-3 flex flex-col gap-2.5">
            <div className="w-6 h-6 rounded-full bg-slate-700 mb-1" />
            <div className="font-bold text-[8px] leading-tight">Jane Doe</div>
            <div className="text-[5px] text-slate-400">Software Engineer</div>
            <div className="flex flex-col gap-1 text-[5px] mt-1 border-t border-slate-800 pt-1.5">
              <span>✉ jane@doe.com</span>
              <span>📱 +1 555-0199</span>
            </div>
            <div className="flex flex-col gap-1 mt-1 border-t border-slate-800 pt-1.5">
              <span className="font-semibold text-slate-400 uppercase text-[5px] tracking-wider">Skills</span>
              <span className="bg-slate-800 px-1 py-0.5 rounded text-center">React</span>
              <span className="bg-slate-800 px-1 py-0.5 rounded text-center">Node.js</span>
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-3">
            <div>
              <div className="font-bold text-[7px] text-slate-900 border-b border-slate-100 pb-1 mb-1.5 uppercase tracking-wide">Summary</div>
              <p className="text-slate-500 text-left leading-normal">Results-oriented developer building high-performance products.</p>
            </div>
            <div>
              <div className="font-bold text-[7px] text-slate-900 border-b border-slate-100 pb-1 mb-1.5 uppercase tracking-wide">Work History</div>
              <div className="flex justify-between font-bold mb-0.5">
                <span>Vercel</span>
                <span>2022 – 2024</span>
              </div>
              <p className="text-slate-400 italic mb-1">Developer Advocate</p>
              <p className="text-slate-500 text-left">• Built core Next.js starter templates.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "minimal-clean",
      name: "Minimal Clean (Single Column)",
      description: "Clean spacing, bold modern headings, sans-serif typography, and bulleted entries optimized for ATS parsers.",
      category: "Minimal",
      accentColor: "#10B981",
      previewLayout: (
        <div className="w-full h-full bg-white flex flex-col p-4 text-[7px] text-slate-800 font-sans leading-none select-none">
          <div className="text-left font-extrabold text-[12px] text-slate-950 mb-0.5">Alex Johnson</div>
          <div className="text-left text-slate-500 text-[6px] mb-3">Product Designer • SF, California • alexj.design</div>
          
          <div className="font-bold text-[7.5px] text-indigo-600 mb-1 border-t border-slate-100 pt-2 text-left">Experience</div>
          <div className="flex justify-between font-bold mb-0.5">
            <span>Figma — Senior Product Designer</span>
            <span>2021 – Present</span>
          </div>
          <p className="text-slate-500 mb-2 text-left">• Designed advanced auto-layout controls used by 1M+ designers.</p>
 
          <div className="font-bold text-[7.5px] text-indigo-600 mb-1 border-t border-slate-100 pt-2 text-left">Education</div>
          <div className="flex justify-between font-bold">
            <span>UC Berkeley</span>
            <span>2016 – 2020</span>
          </div>
          <p className="text-slate-500 text-left">B.A. in Cognitive Science</p>
        </div>
      ),
    },
    {
      id: "elegant-two-column",
      name: "Elegant Two-Column (Split Grid)",
      description: "Sleek top colored band, balanced double columns block separating work achievements from skills and education.",
      category: "Creative",
      accentColor: "#7C3AED",
      previewLayout: (
        <div className="w-full h-full bg-white flex flex-col select-none text-[6.5px] text-slate-700 leading-none">
          <div className="h-1.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
          <div className="p-4 flex-1 flex flex-col gap-3">
            <div className="flex justify-between items-end border-b border-slate-100 pb-2">
              <div>
                <div className="font-bold text-[10px] text-slate-950">Sarah Miller</div>
                <div className="text-[6px] text-slate-500">Marketing Lead</div>
              </div>
              <div className="text-right text-[5.5px] text-slate-400">
                <span>sarah@miller.com</span><br/><span>linkedin/sarah</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-3 flex flex-col gap-2.5">
                <div className="font-bold uppercase tracking-wider text-[6.5px] text-slate-900 border-b border-slate-100 pb-0.5">Work History</div>
                <div>
                  <div className="font-bold">Growth Manager @ Airbnb</div>
                  <div className="text-slate-400 mb-1">2020 – 2023</div>
                  <p className="text-slate-500 text-left">• Managed $2M search campaign budget.</p>
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-2.5">
                <div className="font-bold uppercase tracking-wider text-[6.5px] text-slate-900 border-b border-slate-100 pb-0.5">Expertise</div>
                <div className="flex flex-wrap gap-1 text-[5px]">
                  <span className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">Growth</span>
                  <span className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">SEO/SEM</span>
                  <span className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">SQL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const [templatesList, setTemplatesList] = useState<TemplateInfo[]>(defaultTemplates);

  useEffect(() => {
    axiosInstance.get("/template")
      .then((res) => {
        if (res.data && res.data.data) {
          const apiList = (res.data.data || []).filter((item: any) => item && item.id);
          const merged = apiList.map((item: any) => {
            // If it matches a builtin, find its default details
            const matchedBuiltin = defaultTemplates.find((d) => d.id === item.id);
            if (matchedBuiltin) {
              return matchedBuiltin;
            }
            // Otherwise construct a dynamic template info
            return {
              id: item.id,
              name: item.name || "Unnamed Template",
              description: item.description || "Custom dynamic layout template.",
              category: "Custom",
              accentColor: item.primaryColor || "#1E293B",
              previewLayout: generateMiniPreview(item.layoutType, item.primaryColor),
            } as TemplateInfo;
          });
          if (merged.length > 0) {
            setTemplatesList(merged);
          }
        }
      })
      .catch((err) => {
        console.error("Templates: Error loading templates:", err);
      });
  }, []);

  const handleSelect = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const activeTemplate = templatesList.find((t) => t.id === selectedId);
      const docName = `${activeTemplate ? activeTemplate.name.split(" ")[0] : "New"} Resume`;
      const res = await createResume(docName, selectedId);
      if (res && res._id) {
        navigate(`/builder/${res._id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to setup draft workspace.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans select-none">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/60 text-indigo-600 text-xs font-semibold mb-4">
            <Compass size={14} className="animate-spin-slow" />
            Pick a Starting Layout Preset
          </div>
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">
            Choose Your Resume Template
          </h1>
          <p className="text-slate-500 text-sm mt-2.5 leading-relaxed">
            Every preset is designed carefully with perfect margins, typography hierarchy, and matches industry standard rendering. You can fully customize color accents later.
          </p>
        </div>

        {/* Layout Picker Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {templatesList.map((tpl) => {
            const isSelected = selectedId === tpl.id;
            return (
              <motion.div
                key={tpl.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedId(tpl.id)}
                className={`relative flex flex-col justify-between bg-white border border-slate-200/60 p-4 rounded-3xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-indigo-600 shadow-xl shadow-indigo-100/40"
                    : "hover:shadow-lg hover:border-slate-300"
                }`}
              >
                {/* Checkmark state overlay */}
                {isSelected && (
                  <div className="absolute top-6 right-6 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-md shadow-indigo-500/30 z-10">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                  </div>
                )}

                {/* Template miniature canvas */}
                <div className="w-full aspect-[1/1.41] bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center p-2 group-hover:bg-slate-100/50 transition-colors shadow-inner">
                  <div className="w-full h-full shadow-sm rounded-lg overflow-hidden border border-slate-100 transition-transform duration-300 transform group-hover:scale-[1.02]">
                    {tpl.previewLayout}
                  </div>
                </div>

                {/* Info block */}
                <div className="text-left mt-2 px-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-extrabold text-slate-950 text-sm tracking-tight truncate">
                      {tpl.name}
                    </h3>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    {tpl.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to action footer */}
        <div className="flex items-center justify-center pt-6 border-t border-slate-200 max-w-lg mx-auto">
          <button
            onClick={handleSelect}
            disabled={!selectedId || isCreating}
            className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-900/10 cursor-pointer flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <Sparkles size={16} className="animate-spin text-indigo-400" />
                Preparing Workspace...
              </>
            ) : (
              <>
                Use Selected Layout Preset
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
