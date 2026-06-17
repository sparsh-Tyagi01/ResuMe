import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useResume } from "../context/ResumeContext";
import type { resume } from "../types/models";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const { loadResume, deleteResume } = useResume();

  const [resumes, setResumes] = useState<resume[]>([]);
  const [resumesLoading, setResumesLoading] = useState<boolean>(true);

  const fetchResumes = async () => {
    setResumesLoading(true);
    try {
      const res = await axiosInstance.get("/resume/my");
      if (res.status === 200 && res.data && res.data.data) {
        setResumes(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      toast.error("Failed to load resumes.");
    } finally {
      setResumesLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleEditResume = async (id: string) => {
    const loaded = await loadResume(id);
    if (loaded) {
      navigate(`/builder/${id}`);
    }
  };

  const handleDeleteResume = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    toast((t) => (
      <div className="flex flex-col gap-2.5 p-1 text-left font-sans">
        <p className="text-xs font-bold text-slate-800 leading-normal">
          Are you sure you want to delete this resume?
        </p>
        <p className="text-[10px] text-slate-400 font-medium -mt-1.5">
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadId = toast.loading("Deleting resume...");
              try {
                await deleteResume(id);
                setResumes((prev) => prev.filter((r) => r._id !== id));
                toast.success("Resume deleted successfully!", { id: loadId });
              } catch (err) {
                console.error(err);
                toast.error("Failed to delete resume.", { id: loadId });
              }
            }}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer shadow-sm shadow-rose-500/10"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center",
      style: {
        borderRadius: "16px",
        background: "#FFF",
        color: "#333",
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        border: "1px solid #E2E8F0",
        maxWidth: "280px"
      }
    });
  };

  const handleDuplicateResume = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await axiosInstance.post(`/resume/${id}/duplicate`);
      if (res.status === 201 && res.data && res.data.data) {
        setResumes((prev) => [res.data.data, ...prev]);
        toast.success("Resume duplicated!");
      }
    } catch (err) {
      console.error("Duplicate error:", err);
      toast.error("Failed to duplicate resume.");
    }
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Dashboard Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 pb-4">
          <div className="flex gap-2 items-center">
            <FileText size={22} className="text-blue-600" />
            <h1 className="text-xl font-extrabold text-slate-950 tracking-tight">My Resumes</h1>
          </div>

          <button
            onClick={() => navigate("/templates")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5 align-middle"
          >
            <Plus size={16} /> Create Resume
          </button>
        </div>

        {/* Resumes Grid */}
        <div>
          {resumesLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Sparkles size={24} className="animate-spin text-blue-600" />
              <p className="text-xs font-semibold">Loading your resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200/50 rounded-3xl p-8 max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-950">No Resumes Found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Start by creating your first resume using our professional layout presets.
              </p>
              <button
                onClick={() => navigate("/templates")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer"
              >
                Create Your First Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((r) => (
                <div
                  key={r._id}
                  onClick={() => handleEditResume(r._id!)}
                  className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left cursor-pointer group hover:border-slate-300/80"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                        {r.templateId || "jake-classic"}
                      </span>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button
                          title="Duplicate"
                          onClick={(e) => handleDuplicateResume(e, r._id!)}
                          className="p-1.5 hover:bg-slate-50 border border-slate-150 rounded-lg text-slate-600 cursor-pointer"
                        >
                          <Copy size={13} />
                        </button>

                        <button
                          title="Delete"
                          onClick={(e) => handleDeleteResume(e, r._id!)}
                          className="p-1.5 hover:bg-rose-50 border border-rose-150 rounded-lg text-rose-600 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-950 mb-1 group-hover:text-blue-600 transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Edited{" "}
                      {r.updatedAt
                        ? formatDistanceToNow(new Date(r.updatedAt), { addSuffix: true })
                        : "recently"}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{r.personalInfo?.name || "Untitled Profile"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;