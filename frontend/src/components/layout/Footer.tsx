import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

type ModalType = "guide" | "ats" | "help" | "privacy" | "terms" | "cookies" | null;

export const Footer = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
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
    }
  };

  const modalContents = {
    guide: {
      title: "Resume Writing Guide",
      content: (
        <div className="space-y-3">
          <p>Writing a great resume is about highlighting impact. Follow these core principles:</p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li><strong>Keep it to a Single Page:</strong> Recruiter attention spans average 6 seconds. Keep details punchy.</li>
            <li><strong>Action Verbs First:</strong> Begin bullets with words like "Led," "Optimized," or "Architected."</li>
            <li><strong>Quantify Accomplishments:</strong> Instead of saying "worked on web pages," say "redesigned dashboard, increasing speed by 32%."</li>
            <li><strong>Tailor to the Job:</strong> Use keywords from the job description directly in your skills list.</li>
          </ul>
        </div>
      ),
    },
    ats: {
      title: "ATS Optimization Guide",
      content: (
        <div className="space-y-3">
          <p>Applicant Tracking Systems (ATS) scan resumes for search matches. Ensure yours passes:</p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li><strong>Vector-Clean PDF Layouts:</strong> ResuMe's compiler creates vector layers that trackers read perfectly.</li>
            <li><strong>Standard Section Headings:</strong> Use recognizable tags like "Experience," "Education," and "Skills."</li>
            <li><strong>Text-Based Formats:</strong> Avoid embedding text in images or graphics that parsers cannot scrape.</li>
            <li><strong>Standard Fonts:</strong> Our layouts use premium sans-serif typography suitable for corporate tracking systems.</li>
          </ul>
        </div>
      ),
    },
    help: {
      title: "Help & Support Center",
      content: (
        <div className="space-y-3">
          <p>Need assistance building your resume? Here are answers to common questions:</p>
          <ul className="list-decimal pl-4 space-y-1.5">
            <li><strong>How do I change template layout?</strong> Go to the Builder page and select templates from the top-left dropdown selectors.</li>
            <li><strong>How do I save progress?</strong> ResuMe auto-saves your draft to the database every 30 seconds automatically.</li>
            <li><strong>How do I export PDF?</strong> Click the Print button in the builder control toolbar.</li>
            <li><strong>Still have questions?</strong> Email us directly at <span className="text-blue-600 font-bold">support@resume.io</span>.</li>
          </ul>
        </div>
      ),
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-3">
          <p>Your privacy is important to us. Here is how we manage security:</p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li><strong>Data Ownership:</strong> You own all details. We do not sell your personal data.</li>
            <li><strong>Secure Cloud Backups:</strong> Resume drafts are stored in secure cloud environments to allow autosafe syncing.</li>
            <li><strong>Account Deletion:</strong> You can completely delete your profile and resumes at any time from your account dashboard.</li>
          </ul>
        </div>
      ),
    },
    terms: {
      title: "Terms of Service",
      content: (
        <div className="space-y-3">
          <p>By registering or using ResuMe, you agree to these conditions:</p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li><strong>Platform Purpose:</strong> We provide resume layouts and real-time formatting services.</li>
            <li><strong>No Guaranteed Outcomes:</strong> We are not responsible for application outcomes or interview scheduling.</li>
            <li><strong>Fair Use:</strong> Do not use scripts or scrapers to access the database or overload the servers.</li>
          </ul>
        </div>
      ),
    },
    cookies: {
      title: "Cookie Policy",
      content: (
        <div className="space-y-3">
          <p>We use essential cookies to maintain secure sessions:</p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li><strong>Auth Tokens:</strong> Cookies store secure login references so you do not have to sign in every time.</li>
            <li><strong>No Tracking Ad Cookies:</strong> We do not run third-party tracking or advertising scripts.</li>
            <li><strong>Browser Control:</strong> You can block cookies in browser settings, but it will prevent dashboard authentication.</li>
          </ul>
        </div>
      ),
    },
  };

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200/50 py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand details */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="4.5" height="16" rx="1.5" />
              <path d="M8.5 4h6.5a4.5 4.5 0 0 1 4.5 4.5v0a4.5 4.5 0 0 1-4.5 4.5h-6.5V4z" />
              <path d="M12.5 12h1.5l5 8h-3l-3.5-8z" />
            </svg>
            <span className="text-xl font-bold text-slate-950 tracking-tight">ResuMe</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
            Build professional-quality resumes that actually get interviews. Real-time rendering, dynamic templates, and instant PDF downloads.
          </p>
        </div>

        {/* Product links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-905 mb-4">Product</h4>
          <ul className="space-y-2 text-xs text-slate-500 font-semibold">
            <li>
              <button 
                onClick={() => handleNavClick("templates")}
                className="hover:text-slate-950 transition-colors cursor-pointer text-left font-semibold"
              >
                Resume Templates
              </button>
            </li>
            <li>
              <Link to="/builder" className="hover:text-slate-950 transition-colors">
                Resume Builder
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-905 mb-4">Resources</h4>
          <ul className="space-y-2 text-xs text-slate-500 font-semibold">
            <li 
              onClick={() => setActiveModal("guide")}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              Resume Guide
            </li>
            <li 
              onClick={() => setActiveModal("ats")}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              ATS Optimization
            </li>
            <li 
              onClick={() => setActiveModal("help")}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              Help Center
            </li>
          </ul>
        </div>

        {/* Legal & Social */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-905 mb-4">Legal</h4>
          <ul className="space-y-2 text-xs text-slate-500 font-semibold">
            <li 
              onClick={() => setActiveModal("privacy")}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              Privacy Policy
            </li>
            <li 
              onClick={() => setActiveModal("terms")}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              Terms of Service
            </li>
            <li 
              onClick={() => setActiveModal("cookies")}
              className="hover:text-slate-950 transition-colors cursor-pointer"
            >
              Cookie Policy
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
        <p>© 2026 ResuMe. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <span className="text-rose-500">❤️</span> in India
        </p>
      </div>

      {activeModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white border border-slate-200/80 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-900 flex flex-col max-h-[85vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors text-base font-bold cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-base font-black tracking-tight mb-4 border-b border-slate-100 pb-2 text-slate-950 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="4.5" height="16" rx="1.5" />
                <path d="M8.5 4h6.5a4.5 4.5 0 0 1 4.5 4.5v0a4.5 4.5 0 0 1-4.5 4.5h-6.5V4z" />
                <path d="M12.5 12h1.5l5 8h-3l-3.5-8z" />
              </svg>
              {modalContents[activeModal].title}
            </h3>
            <div className="text-xs text-slate-600 space-y-3 font-semibold leading-relaxed">
              {modalContents[activeModal].content}
            </div>
            <button 
              onClick={() => setActiveModal(null)}
              className="mt-6 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer w-full shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
