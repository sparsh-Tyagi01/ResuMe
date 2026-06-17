import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import LayoutRenderer from "../components/templates/LayoutRenderer";
import FlowArt, { FlowSection } from "../components/ui/story-scroll";
import { CardStack } from "../components/ui/card-stack";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../lib/axios";
import type { resume } from "../types/models";
import {
  FileText,
  MousePointerClick,
  Download,
  Layout,
  ChevronRight,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";

const sampleData: resume = {
  title: "Software Engineer",
  templateId: "jake-classic",
  personalInfo: {
    name: "Alex Morgan",
    title: "Senior Software Engineer",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    portfolio: "alexmorgan.dev"
  },
  summary: "Driven and performance-focused Software Engineer with 5+ years of experience constructing scalable cloud architectures and optimizing front-end performance.",
  experience: [
    {
      id: "e1",
      company: "TechCorp SaaS",
      role: "Lead Frontend Engineer",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      location: "New York, NY",
      bullets: [
        "Spearheaded redevelopment of web dashboard, accelerating paint times by 32%.",
        "Mentored a cross-functional group of 6 engineers on React and system design."
      ]
    }
  ],
  education: [
    {
      id: "ed1",
      institution: "MIT",
      degree: "Master of Science",
      field: "Computer Science",
      startYear: "2017",
      endYear: "2019",
      gpa: "4.0"
    }
  ],
  skills: {
    languages: ["TypeScript", "JavaScript", "Python", "SQL"],
    frameworks: ["React", "Next.js", "Node.js", "Tailwind CSS"],
    tools: ["Docker", "Git", "AWS", "PostgreSQL"],
    other: ["ATS Optimization", "System Design", "Agile SCRUM"]
  },
  projects: [
    {
      id: "p1",
      name: "Collaborative Resume Editor",
      techStack: ["React", "WebSockets", "Go"],
      date: "2023",
      bullets: [
        "Implemented real-time OT sync for side-by-side builder viewports."
      ]
    }
  ]
};

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      setTimeout(() => {
        const sectionIndexes: Record<string, number> = {
          hero: 0,
          templates: 1,
          features: 2,
          "how-it-works": 3,
        };
        if (sectionId in sectionIndexes) {
          window.scrollTo({
            top: sectionIndexes[sectionId] * window.innerHeight,
            behavior: "smooth",
          });
        } else {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSelectTemplate = (templateId: string) => {
    localStorage.setItem("selectedTemplateId", templateId);
    if (token) {
      navigate("/builder");
    } else {
      toast.success("Template selected! Create an account to start editing.");
      navigate("/register");
    }
  };

  const [templatesList, setTemplatesList] = useState([
    { id: "jake-classic", name: "Jake's Classic", desc: "Clean black-and-white serif layout, optimized for software and financial careers." },
    { id: "modern-blue", name: "Modern Navy Sidebar", desc: "Striking left sidebar highlighting contact coordinates and skills category tags." },
    { id: "minimal-clean", name: "Minimal Single Column", desc: "Generous whitespace, thin dividers, and a modern custom-color layout." },
    { id: "elegant-two-column", name: "Elegant Split Grid", desc: "Visual two-column layout with serif headers, balancing detail densities." }
  ]);

  useEffect(() => {
    axiosInstance.get("/template")
      .then((res) => {
        if (res.data && res.data.data) {
          const list = res.data.data
            .filter((t: any) => t && t.id)
            .map((t: any) => ({
              id: t.id,
              name: t.name || "Unnamed Template",
              desc: t.description || "Dynamic template layout configuration.",
            }));
          if (list.length > 0) {
            setTemplatesList(list);
          }
        }
      })
      .catch((err) => console.error("Error fetching templates for landing page:", err));
  }, []);

  const templatesItems = templatesList.map(temp => ({
    id: temp.id,
    title: temp.name,
    description: temp.desc,
  }));

  const cardWidth = windowWidth < 485 ? windowWidth - 48 : 310;
  const cardHeight = windowWidth < 485 ? (windowWidth - 48) * 1.35 : 420;

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <FlowArt>
        <FlowSection id="hero" className="bg-[#f3f6fc] text-slate-900 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] md:text-xs font-bold tracking-widest text-blue-600 uppercase">
            <span>01 / INTRODUCTION</span>
            <span>RESUME BUILDER</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.05]">
                Build Resumes That <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Actually Get Interviews</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
                Create professional-grade resumes with live previewing, automated formatting, and beautiful pre-designed layouts. No complex setups or manual margins.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate(token ? "/dashboard" : "/register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
                >
                  Start for Free
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("templates");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold text-sm px-8 py-4 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  See Templates
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-5 hidden lg:flex justify-center relative min-h-[400px]">
              <motion.div
                animate={{ y: [-10, 10] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="absolute left-4 top-8 w-[200px] border border-slate-200/80 shadow-2xl rounded-xl overflow-hidden bg-white p-2.5 origin-center rotate-[-6deg]"
              >
                <div className="text-[3px] leading-tight select-none pointer-events-none opacity-90 scale-[0.67] transform origin-top-left w-[290px]">
                  <LayoutRenderer templateId="jake-classic" data={sampleData} />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
                className="absolute right-4 top-12 w-[200px] border border-slate-200/80 shadow-2xl rounded-xl overflow-hidden bg-white p-2.5 origin-center rotate-[6deg]"
              >
                <div className="text-[3px] leading-tight select-none pointer-events-none opacity-90 scale-[0.67] transform origin-top-left w-[290px]">
                  <LayoutRenderer templateId="modern-blue" data={sampleData} />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [-5, 5] }}
                transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
                className="absolute left-[25%] top-16 w-[210px] border border-slate-200/80 shadow-2xl rounded-xl overflow-hidden bg-white p-2.5 z-20 origin-center"
              >
                <div className="text-[3px] leading-tight select-none pointer-events-none opacity-90 scale-[0.67] transform origin-top-left w-[290px]">
                  <LayoutRenderer templateId="minimal-clean" data={sampleData} />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="border-t border-slate-200/60 pt-4 flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>scroll to explore</span>
            <span>real-time live previews</span>
          </div>
        </FlowSection>

        <FlowSection id="templates" className="bg-[#0b0f19] text-white flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] md:text-xs font-bold tracking-widest text-indigo-400 uppercase">
            <span>02 / TEMPLATES</span>
            <span>{templatesList.length} PROFESSIONAL FORMATS</span>
          </div>

          <div className="my-auto flex flex-col md:flex-row items-center justify-between gap-8 w-full max-w-6xl mx-auto py-4">
            <div className="text-left max-w-md shrink-0 space-y-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Choose Your Layout
              </h2>
              <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
                We support four premium, ATS-compliant formats. Switch styles instantly inside the editor.
              </p>
              
              <div className="hidden md:flex flex-col gap-2.5 mt-6 text-slate-400 text-xs font-medium">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Swipe left or right to switch templates
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Drag cards directly to browse layouts
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Click a card to bring it to front
                </p>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md flex justify-center items-center">
              <CardStack
                items={templatesItems}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                showDots={true}
                renderCard={(item, state) => {
                  if (!item || !item.id) return null;
                  return (
                    <div className="relative w-full h-full bg-slate-900 border-2 border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-hidden">
                      <div className="relative flex-1 rounded-lg overflow-hidden bg-white border border-slate-800 mb-3 shadow-inner">
                        <div className="absolute inset-0 scale-[0.22] origin-top-left p-3 w-[794px] h-[1123px] select-none pointer-events-none text-slate-900">
                          <LayoutRenderer templateId={item.id.toString()} data={sampleData} />
                        </div>
                        
                        {state.active && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTemplate(item.id.toString());
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer shadow-lg z-30"
                            >
                              Use Template
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="text-left min-w-0">
                          <h4 className="text-xs font-bold text-white mb-0.5 truncate">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 leading-snug line-clamp-1">{item.description}</p>
                        </div>
                        {state.active && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTemplate(item.id.toString());
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors shrink-0 flex items-center gap-0.5 cursor-pointer border border-slate-700"
                          >
                            Choose
                            <ChevronRight size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>ats parser optimized</span>
            <span>vector-clean print layout</span>
          </div>
        </FlowSection>

        <FlowSection id="features" className="bg-[#fcfbf9] text-slate-900 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] md:text-xs font-bold tracking-widest text-amber-600 uppercase">
            <span>03 / POWERFUL FEATURES</span>
            <span>DESIGNED FOR SPEED</span>
          </div>

          <div className="my-auto space-y-10">
            <div className="text-left max-w-xl">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950 leading-tight">
                A Frictionless Editor
              </h2>
              <p className="text-xs md:text-sm text-slate-505 font-medium leading-relaxed mt-2">
                No complicated configuration. ResuMe gives you everything you need to build, style, and download your resume instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-200/70 p-6 rounded-2xl flex flex-col items-start gap-3 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <MousePointerClick size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-950">Interactive Form Editor</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill your credentials inside structured, guided sections designed for fast data entry.
                </p>
              </div>

              <div className="bg-white border border-slate-200/70 p-6 rounded-2xl flex flex-col items-start gap-3 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-950">Real-time Live Preview</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Watch your layout format and build dynamically side-by-side with your form fields.
                </p>
              </div>

              <div className="bg-white border border-slate-200/70 p-6 rounded-2xl flex flex-col items-start gap-3 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
                  <Layout size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-950">Custom Color Accents</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Easily personalize primary theme accent colors to match your individual style.
                </p>
              </div>

              <div className="bg-white border border-slate-200/70 p-6 rounded-2xl flex flex-col items-start gap-3 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Lock size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-950">Auto-Save Security</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Edits sync to the cloud database automatically every 30 seconds, protecting your progress.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/60 pt-4 flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>built-in cloud sync</span>
            <span>zero layout friction</span>
          </div>
        </FlowSection>

        <FlowSection id="how-it-works" className="bg-[#111926] text-white flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] md:text-xs font-bold tracking-widest text-emerald-400 uppercase">
            <span>04 / THE SYSTEM</span>
            <span>SIMPLE WORKFLOW</span>
          </div>

          <div className="my-auto space-y-10">
            <div className="text-left max-w-xl">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Create Your Resume in Minutes
              </h2>
              <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed mt-2">
                A structured walkthrough outlining how quickly you can create your job application document.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl text-left relative">
                <div className="absolute top-4 right-6 text-5xl font-black text-slate-800/60 select-none">01</div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                  <Layout size={18} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Pick a Template</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Select one of our four ATS-optimized layouts. Switch templates cleanly with one click at any time.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl text-left relative">
                <div className="absolute top-4 right-6 text-5xl font-black text-slate-800/60 select-none">02</div>
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center mb-6">
                  <MousePointerClick size={18} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Fill Details</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Input experience details, qualifications, and project links. The live layout formats automatically.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl text-left relative">
                <div className="absolute top-4 right-6 text-5xl font-black text-slate-800/60 select-none">03</div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                  <Download size={18} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Download PDF</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Generate vector-clean PDF copies immediately. Ready for direct applications and ATS parsing.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>browser based layout</span>
            <span>no subscriptions required</span>
          </div>
        </FlowSection>

        <FlowSection id="cta" className="bg-[#070a13] text-slate-300 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] md:text-xs font-bold tracking-widest text-blue-400 uppercase">
            <span>05 / GET STARTED</span>
            <span>JOIN RESUME</span>
          </div>

          <div className="my-auto text-center max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Ready to Build Your Resume?
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
              Create a free account to select formats, fill your details, and export a polished resume today.
            </p>

            <div>
              <button
                onClick={() => navigate(token ? "/dashboard" : "/register")}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
              >
                Start Building Now
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>secure database backup</span>
            <span>completely customizable templates</span>
          </div>
        </FlowSection>
      </FlowArt>

      <Footer />
    </div>
  );
};

export default Landing;
