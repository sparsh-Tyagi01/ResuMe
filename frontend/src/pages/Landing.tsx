import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import LayoutRenderer from "../components/templates/LayoutRenderer";
import { useAuth } from "../context/AuthContext";
import type { resume } from "../types/models";
import {
  Sparkles,
  FileText,
  MousePointerClick,
  Download,
  Layout,
  Search,
  Lock,
  ChevronRight,
  TrendingUp,
  Users,
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

// Simple CountUp Component
const Counter: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = Math.ceil(end / (duration / 16));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl font-extrabold text-slate-950 tracking-tight">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      // Clear state after scrolling
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

  const templatesList = [
    { id: "jake-classic", name: "Jake's Classic", desc: "Clean black-and-white serif layout, optimized for software and financial careers." },
    { id: "modern-blue", name: "Modern Navy Sidebar", desc: "Striking left sidebar highlighting contact coordinates and skills category tags." },
    { id: "minimal-clean", name: "Minimal Single Column", desc: "Generous whitespace, thin dividers, and a modern custom-color layout." },
    { id: "elegant-two-column", name: "Elegant Split Grid", desc: "Visual two-column layout with serif headers, balancing detail densities." }
  ];

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-between overflow-hidden bg-[#FAFBFF] px-6 lg:px-20 py-20 border-b border-slate-200/30">
        {/* Ambient Gradient Blob */}
        <div className="absolute top-[20%] left-[5%] w-96 h-96 rounded-full bg-indigo-200/40 blur-3xl opacity-60"></div>
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-blue-200/40 blur-3xl opacity-60"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tight leading-[1.08] max-w-xl">
                Build Resumes That Actually Get <span className="text-blue-600">Interviews</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                Create professional-grade resumes with live previewing, automated formatting, and beautiful pre-designed layouts. No complex setups.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate(token ? "/dashboard" : "/register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
                >
                  Start for Free
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("templates");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold px-7 py-4 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  See Templates
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Floating Previews Column */}
          <div className="hidden lg:flex justify-center relative min-h-[480px] w-full">
            {/* Drifting Resume Previews */}
            <motion.div
              animate={{ y: [-15, 15] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="absolute left-0 top-10 w-[240px] border border-slate-200 shadow-2xl rounded-xl overflow-hidden bg-white p-3 origin-center rotate-[-6deg]"
            >
              <div className="text-[4px] leading-tight select-none pointer-events-none opacity-90 scale-75 transform origin-top-left w-[300px]">
                <LayoutRenderer templateId="jake-classic" data={sampleData} />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [15, -15] }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
              className="absolute right-0 top-16 w-[240px] border border-slate-200 shadow-2xl rounded-xl overflow-hidden bg-white p-3 origin-center rotate-[6deg]"
            >
              <div className="text-[4px] leading-tight select-none pointer-events-none opacity-90 scale-75 transform origin-top-left w-[300px]">
                <LayoutRenderer templateId="modern-blue" data={sampleData} />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [-10, 10] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
              className="absolute left-[30%] top-24 w-[250px] border border-slate-200 shadow-2xl rounded-xl overflow-hidden bg-white p-3 z-20 origin-center"
            >
              <div className="text-[4px] leading-tight select-none pointer-events-none opacity-90 scale-75 transform origin-top-left w-[300px]">
                <LayoutRenderer templateId="minimal-clean" data={sampleData} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Templates Section (Section 2) */}
      <section id="templates" className="w-full py-24 bg-white border-b border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-950 tracking-tight">
              Choose from 4+ Professional Templates
            </h2>
            <p className="text-slate-500 font-semibold text-lg max-w-xl mx-auto">
              Real-time rendered HTML layouts optimized to look stunning both on-screen and when compiled to vector A4 PDFs.
            </p>
          </div>

          {/* Carousel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {templatesList.map((temp) => (
              <motion.div
                key={temp.id}
                whileHover={{ rotateY: -6, rotateX: 3, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                style={{ perspective: 1000 }}
                className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group relative flex flex-col justify-between"
              >
                <div>
                  {/* Template Mini Preview Area */}
                  <div className="aspect-[1/1.4] rounded-2xl overflow-hidden bg-white border border-slate-100 mb-5 relative shadow-inner">
                    <div className="absolute inset-0 scale-[0.25] origin-top-left p-4 w-[794px] h-[1123px] select-none pointer-events-none">
                      <LayoutRenderer templateId={temp.id} data={sampleData} />
                    </div>

                    {/* Use Template Overlay Button */}
                    <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <button
                        onClick={() => handleSelectTemplate(temp.id)}
                        className="bg-white text-slate-950 font-bold text-xs py-3 px-5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shadow-lg"
                      >
                        Use This Template
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-950 mb-1 group-hover:text-blue-600 transition-colors">
                    {temp.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    {temp.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleSelectTemplate(temp.id)}
                  className="mt-6 w-full py-3 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Choose Format
                  <ChevronRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section (Section 3) */}
      <section id="how-it-works" className="w-full py-24 bg-[#FAFBFF] border-b border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-950 tracking-tight">
              Create Your Resume in Minutes
            </h2>
            <p className="text-slate-500 font-semibold text-lg max-w-xl mx-auto">
              Follow three simple steps to produce a professionally styled job application document.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-lg shadow-blue-500/25">
                1
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Layout size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Pick a Template</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
                Select one of our 4 layout options. You can easily switch designs with one click later.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-lg shadow-blue-500/25">
                2
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                <MousePointerClick size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Fill Your Details</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
                Type in your experience, education, and skills. Watch the preview canvas update instantly.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-lg shadow-blue-500/25">
                3
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Download size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Download PDF</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
                Export a vector A4 PDF using print tools or instant document downloads. Ready to upload.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid Section (Section 4) */}
      <section id="features" className="w-full py-24 bg-white border-b border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-950 tracking-tight">
              Designed to Accelerate Your Job Search
            </h2>
            <p className="text-slate-500 font-semibold text-lg max-w-xl mx-auto">
              A comprehensive toolkit constructed to make drafting and management of job assets frictionless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50/40 border-2 border-transparent hover:border-blue-500/30 rounded-3xl p-6 text-left flex flex-col items-start gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-slate-100 cursor-default group">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <MousePointerClick size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-950 group-hover:text-blue-600 transition-colors">
                Interactive Form Editor
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Input your work history, education, and credentials easily inside a structured editor designed for speed.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-slate-50/40 border-2 border-transparent hover:border-blue-500/30 rounded-3xl p-6 text-left flex flex-col items-start gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-slate-100 cursor-default group">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <FileText size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-950 group-hover:text-indigo-600 transition-colors">
                Real-time Live Preview
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                View your inputs dynamically formatted side-by-side with our real-time, responsive preview panels.
              </p>
            </div>            {/* Feature 3 */}
            <div className="bg-slate-50/40 border-2 border-transparent hover:border-blue-500/30 rounded-3xl p-6 text-left flex flex-col items-start gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-slate-100 cursor-default group">
              <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
                <Layout size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-950 group-hover:text-violet-600 transition-colors">
                Custom Color Accents
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Choose template designs and instantly customize theme accents with real-time vector PDF adjustments.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50/40 border-2 border-transparent hover:border-blue-500/30 rounded-3xl p-6 text-left flex flex-col items-start gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-slate-100 cursor-default group">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Download size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-950 group-hover:text-emerald-600 transition-colors">
                Vector-Clean PDF Exports
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Ensure text elements export in crystal-clear vector profiles. Fully print and ATS parser friendly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50/40 border-2 border-transparent hover:border-blue-500/30 rounded-3xl p-6 text-left flex flex-col items-start gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-slate-100 cursor-default group">
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
                <Search size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-950 group-hover:text-cyan-600 transition-colors">
                ATS Optimization
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Our templates follow proper header structures, layout indexes, and fonts to maximize ATS compatibility.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-50/40 border-2 border-transparent hover:border-blue-500/30 rounded-3xl p-6 text-left flex flex-col items-start gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-slate-100 cursor-default group">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <Lock size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-950 group-hover:text-rose-600 transition-colors">
                Auto-Save Security
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Your draft progress automatically syncs to the server every 30 seconds, keeping your work protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof (Section 5) */}
      <section className="w-full py-20 bg-slate-50/60 border-b border-slate-100 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200/50 p-8 rounded-3xl shadow-sm text-center flex flex-col items-center gap-2">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl mb-1">
              <Users size={20} />
            </div>
            <Counter value={50000} suffix="+" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Users</p>
          </div>
          
          <div className="bg-white border border-slate-200/50 p-8 rounded-3xl shadow-sm text-center flex flex-col items-center gap-2">
            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl mb-1">
              <FileText size={20} />
            </div>
            <Counter value={100000} suffix="+" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Resumes Created</p>
          </div>
          
          <div className="bg-white border border-slate-200/50 p-8 rounded-3xl shadow-sm text-center flex flex-col items-center gap-2">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl mb-1">
              <TrendingUp size={20} />
            </div>
            <Counter value={85} suffix="%" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Interview Rate</p>
          </div>
        </div>
      </section>

      {/* CTA Banner Section (Section 6) */}
      <section className="w-full py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 text-center px-6 relative overflow-hidden">
        {/* Soft grid overlay pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Ready to Build Your Resume?
          </h2>
          <p className="text-slate-600 font-medium max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Register your profile for free and start tailoring your resume layout for your next career move.
          </p>

          <button
            onClick={() => navigate(token ? "/dashboard" : "/register")}
            className="mt-4 bg-slate-950 hover:bg-slate-900 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-slate-950/10 hover:scale-[1.02] cursor-pointer"
          >
            Start Building Now
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
