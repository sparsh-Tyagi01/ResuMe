import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200/50 py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand details */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="4.5" height="16" rx="1.5" />
              <rect x="10.5" y="4" width="10.5" height="4" rx="1.5" />
              <rect x="10.5" y="10" width="7" height="4" rx="1.5" />
            </svg>
            <span className="text-xl font-bold text-slate-950 tracking-tight">Flowtica</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
            Build LaTeX-quality resumes that actually get interviews. Real-time rendering, Kanban job tracking, and text suggestions.
          </p>
        </div>

        {/* Product links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-905 mb-4">Product</h4>
          <ul className="space-y-2 text-xs text-slate-500 font-semibold">
            <li>
              <Link to="/templates" className="hover:text-slate-950 transition-colors">
                Resume Templates
              </Link>
            </li>
            <li>
              <Link to="/builder" className="hover:text-slate-950 transition-colors">
                Resume Builder
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-slate-950 transition-colors">
                Kanban Tracker
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-905 mb-4">Resources</h4>
          <ul className="space-y-2 text-xs text-slate-500 font-semibold">
            <li className="hover:text-slate-950 transition-colors cursor-pointer">LaTeX Guide</li>
            <li className="hover:text-slate-950 transition-colors cursor-pointer">ATS Optimization</li>
            <li className="hover:text-slate-950 transition-colors cursor-pointer">Help Center</li>
          </ul>
        </div>

        {/* Legal & Social */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-905 mb-4">Legal</h4>
          <ul className="space-y-2 text-xs text-slate-500 font-semibold">
            <li className="hover:text-slate-950 transition-colors cursor-pointer">Privacy Policy</li>
            <li className="hover:text-slate-950 transition-colors cursor-pointer">Terms of Service</li>
            <li className="hover:text-slate-950 transition-colors cursor-pointer">Cookie Policy</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
        <p>© 2026 Flowtica. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <span className="text-rose-500">❤️</span> in India
        </p>
      </div>
    </footer>
  );
};

export default Footer;
