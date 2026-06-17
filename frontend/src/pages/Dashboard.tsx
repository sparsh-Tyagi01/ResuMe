import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useResume } from "../context/ResumeContext";
import type { resume, job } from "../types/models";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {
  FileText,
  Briefcase,
  Plus,
  Trash2,
  Copy,
  Share2,
  ExternalLink,
  Calendar,
  Sparkles,
  MapPin,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const { loadResume, deleteResume } = useResume();

  const [activeTab, setActiveTab] = useState<"resumes" | "jobs">("resumes");
  const [resumes, setResumes] = useState<resume[]>([]);
  const [jobs, setJobs] = useState<job[]>([]);
  const [resumesLoading, setResumesLoading] = useState<boolean>(true);
  const [jobsLoading, setJobsLoading] = useState<boolean>(true);

  // Job Modal state
  const [showAddJobModal, setShowAddJobModal] = useState<boolean>(false);
  const [jobForm, setJobForm] = useState({
    jobTitle: "",
    company: "",
    location: "Remote",
    jobLink: "",
    status: "Applied" as job["status"],
    note: "",
    resumeId: "",
  });

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

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await axiosInstance.get("/job/my");
      if (res.status === 200 && res.data && res.data.data) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      toast.error("Failed to load job applications.");
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
    fetchJobs();
  }, []);

  // Resume handlers
  const handleEditResume = async (id: string) => {
    const loaded = await loadResume(id);
    if (loaded) {
      navigate(`/builder/${id}`);
    }
  };

  const handleDeleteResume = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resume");
    }
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

  const handleShareResume = async (e: React.MouseEvent, r: resume) => {
    e.stopPropagation();
    const newShareState = !r.isPublic;
    try {
      const res = await axiosInstance.put(`/resume/${r._id}/share`, { isPublic: newShareState });
      if (res.status === 200) {
        setResumes((prev) =>
          prev.map((item) =>
            item._id === r._id ? { ...item, isPublic: res.data.isPublic, shareToken: res.data.shareToken } : item
          )
        );

        if (newShareState) {
          const shareUrl = `${window.location.origin}/shared/${res.data.shareToken}`;
          navigator.clipboard.writeText(shareUrl);
          toast.success("Public link copied to clipboard!");
        } else {
          toast.success("Resume is now private");
        }
      }
    } catch (err) {
      console.error("Share toggle error:", err);
      toast.error("Failed to update share setting.");
    }
  };

  // Job Application handlers
  const handleAddJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { jobTitle, company, jobLink } = jobForm;
    if (!jobTitle || !company || !jobLink) {
      toast.error("Please fill in required fields.");
      return;
    }

    try {
      const res = await axiosInstance.post("/job/create", jobForm);
      if (res.status === 200 && res.data && res.data.data) {
        setJobs((prev) => [res.data.data, ...prev]);
        toast.success("Application tracked!");
        setShowAddJobModal(false);
        // Reset form
        setJobForm({
          jobTitle: "",
          company: "",
          location: "Remote",
          jobLink: "",
          status: "Applied",
          note: "",
          resumeId: "",
        });
      }
    } catch (err) {
      console.error("Add job error:", err);
      toast.error("Failed to add job application.");
    }
  };

  const handleDeleteJob = async (id: string) => {
    // Optimistic UI update
    setJobs((prev) => prev.filter((j) => j._id !== id));
    toast.success("Job deleted");
    
    try {
      await axiosInstance.delete(`/job/${id}`);
    } catch (err) {
      console.error("Delete job error:", err);
      toast.error("Failed to delete from database. Refreshing list...");
      fetchJobs();
    }
  };

  // Kanban Native Drag and Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: job["status"]) => {
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    // Optimistically update status
    setJobs((prev) =>
      prev.map((j) => (j._id === id ? { ...j, status: targetStatus } : j))
    );

    try {
      await axiosInstance.put(`/job/${id}`, { status: targetStatus });
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Failed to update status.");
      fetchJobs();
    }
  };

  const columns: { status: job["status"]; color: string; label: string }[] = [
    { status: "Applied", color: "bg-blue-600", label: "Applied" },
    { status: "Interview", color: "bg-amber-500", label: "Interviewing" },
    { status: "Offer", color: "bg-emerald-600", label: "Offer Received" },
    { status: "Rejected", color: "bg-rose-600", label: "Rejected" },
  ];

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Dashboard Tabs & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200 pb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("resumes")}
              className={`pb-4 text-base font-extrabold transition-all border-b-2 px-1 cursor-pointer ${
                activeTab === "resumes"
                  ? "border-blue-600 text-slate-950 font-black"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <FileText size={18} /> My Resumes
              </span>
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`pb-4 text-base font-extrabold transition-all border-b-2 px-1 cursor-pointer ${
                activeTab === "jobs"
                  ? "border-blue-600 text-slate-950 font-black"
                  : "border-transparent text-slate-400 hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <Briefcase size={18} /> Job Applications
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "resumes" ? (
              <button
                onClick={() => navigate("/templates")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={16} /> Create Resume
              </button>
            ) : (
              <button
                onClick={() => setShowAddJobModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={16} /> Track Application
              </button>
            )}
          </div>
        </div>

        {/* Resumes Tab */}
        {activeTab === "resumes" && (
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
                  Start by creating your first resume using our LaTeX-inspired layout presets.
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
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            title="Duplicate"
                            onClick={(e) => handleDuplicateResume(e, r._id!)}
                            className="p-1.5 hover:bg-slate-50 border border-slate-150 rounded-lg text-slate-600 cursor-pointer"
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            title={r.isPublic ? "Make Private" : "Get Public Link"}
                            onClick={(e) => handleShareResume(e, r)}
                            className={`p-1.5 border rounded-lg cursor-pointer ${
                              r.isPublic
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                : "hover:bg-slate-50 border-slate-150 text-slate-600"
                            }`}
                          >
                            <Share2 size={13} />
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
                      {r.isPublic && (
                        <span className="text-indigo-600 font-bold flex items-center gap-1">
                          Shared <ExternalLink size={10} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Job Applications Tab */}
        {activeTab === "jobs" && (
          <div>
            {jobsLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-500">
                <Sparkles size={24} className="animate-spin text-blue-600" />
                <p className="text-xs font-semibold">Loading applications...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200/50 rounded-3xl p-8 max-w-md mx-auto space-y-4 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-950">No Job Applications</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Start tracking your applications. Drag and drop them across your Kanban pipeline statuses.
                </p>
                <button
                  onClick={() => setShowAddJobModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors cursor-pointer"
                >
                  Track Application
                </button>
              </div>
            ) : (
              /* Kanban board columns container */
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                {columns.map((col) => {
                  const columnJobs = jobs.filter((j) => j.status === col.status);
                  return (
                    <div
                      key={col.status}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, col.status)}
                      className="bg-slate-100 rounded-3xl p-4 min-h-[450px] flex flex-col gap-3.5 border border-slate-200/30 shadow-inner"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            {col.label}
                          </span>
                        </div>
                        <span className="text-[10px] bg-slate-200/80 px-2 py-0.5 rounded-full text-slate-600 font-bold">
                          {columnJobs.length}
                        </span>
                      </div>

                      {/* Column Cards */}
                      <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-0.5">
                        {columnJobs.map((j) => (
                          <div
                            key={j._id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, j._id)}
                            className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 cursor-grab active:cursor-grabbing"
                          >
                            <div>
                              <div className="flex justify-between items-start gap-2 mb-1">
                                <h4 className="text-sm font-bold text-slate-950 break-words">{j.jobTitle}</h4>
                                <button
                                  onClick={() => handleDeleteJob(j._id)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded hover:bg-slate-50 cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <p className="text-xs text-slate-600 font-semibold mb-2">{j.company}</p>
                              
                              {j.location && (
                                <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-slate-400 mb-1">
                                  <MapPin size={10} /> {j.location}
                                </span>
                              )}
                              {j.note && (
                                <p className="text-[10.5px] text-slate-400 italic line-clamp-2 mt-1 leading-normal">
                                  {j.note}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-[10px] text-slate-400 font-semibold mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar size={10} />
                                {new Date(j.createdAt).toLocaleDateString()}
                              </span>
                              {j.jobLink && (
                                <a
                                  href={j.jobLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-0.5"
                                >
                                  Posting <ExternalLink size={8} />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Job tracked Application Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md p-6 rounded-3xl shadow-2xl relative text-left">
            <h3 className="text-lg font-bold text-slate-950 mb-4 flex items-center gap-1.5">
              <Briefcase size={20} className="text-blue-600" />
              Track Job Application
            </h3>
            
            <form onSubmit={handleAddJobSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe"
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Frontend Engineer"
                  value={jobForm.jobTitle}
                  onChange={(e) => setJobForm({ ...jobForm, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Posting URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://jobs.stripe.com/..."
                  value={jobForm.jobLink}
                  onChange={(e) => setJobForm({ ...jobForm, jobLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco or Remote"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Pipeline Status</label>
                  <select
                    value={jobForm.status}
                    onChange={(e) => setJobForm({ ...jobForm, status: e.target.value as job["status"] })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-xs text-slate-700"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interviewing</option>
                    <option value="Offer">Offer Received</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {resumes.length > 0 && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Associated Resume</label>
                  <select
                    value={jobForm.resumeId}
                    onChange={(e) => setJobForm({ ...jobForm, resumeId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-xs text-slate-700"
                  >
                    <option value="">-- None --</option>
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Notes</label>
                <textarea
                  placeholder="Notes about dates, interviewers, or parameters..."
                  rows={3}
                  value={jobForm.note}
                  onChange={(e) => setJobForm({ ...jobForm, note: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md shadow-blue-500/15"
                >
                  Save Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;