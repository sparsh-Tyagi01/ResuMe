import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
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

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="4.5" height="16" rx="1.5" />
            <path d="M8.5 4h6.5a4.5 4.5 0 0 1 4.5 4.5v0a4.5 4.5 0 0 1-4.5 4.5h-6.5V4z" />
            <path d="M12.5 12h1.5l5 8h-3l-3.5-8z" />
          </svg>
          <span className="text-xl font-bold text-slate-950 tracking-tight">ResuMe</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-[13.5px] font-semibold text-slate-600">
          <button onClick={() => handleNavClick("features")} className="hover:text-slate-950 transition-colors cursor-pointer">
            Features
          </button>
          <button onClick={() => handleNavClick("templates")} className="hover:text-slate-950 transition-colors cursor-pointer">
            Templates
          </button>
          <button onClick={() => handleNavClick("how-it-works")} className="hover:text-slate-950 transition-colors cursor-pointer">
            How it Works
          </button>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="text-slate-700 hover:text-slate-950 font-bold text-xs px-4 py-2 rounded-full transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="border border-slate-950 text-slate-950 hover:bg-slate-50 font-bold text-xs px-5 py-2.5 rounded-full transition-all cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-700 hover:text-slate-950 font-semibold text-xs px-4 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-full transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Start for Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-slate-600 hover:text-slate-950 cursor-pointer"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/50 bg-white p-6 space-y-4 shadow-xl flex flex-col">
          <button
            onClick={() => handleNavClick("features")}
            className="text-left font-bold text-slate-700 hover:text-slate-950 text-sm py-1 cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick("templates")}
            className="text-left font-bold text-slate-700 hover:text-slate-950 text-sm py-1 cursor-pointer"
          >
            Templates
          </button>
          <button
            onClick={() => handleNavClick("how-it-works")}
            className="text-left font-bold text-slate-700 hover:text-slate-950 text-sm py-1 cursor-pointer"
          >
            How it Works
          </button>
          
          <hr className="border-slate-100" />
          
          {token ? (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate("/");
                }}
                className="w-full text-center py-2.5 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10"
              >
                Start for Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
