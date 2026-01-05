import { useEffect, useState } from "react";
import { type job, type resume } from "../types/models";
import { axiosInstance } from "../lib/axios";
import {
  Briefcase,
  Calendar,
  Edit2,
  ExternalLink,
  FileText,
  Filter,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import AddJobModal from "./addJobModal";
import toast from "react-hot-toast";

const Job = () => {
  const [jobs, setJobs] = useState<job[]>([]);
  const [resumes, setResumes] = useState<resume[]>([]);
  const [showAddJob, setShowAddJob] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    async function getJob() {
      const res = await axiosInstance.get("/job/myResume");
      setJobs(res.data);
    }
    getJob();

    async function getResume() {
      const res = await axiosInstance.get("/resume/myResume");
      setResumes(res.data);
    }
    getResume();
  }, []);

  const handleAddJob = async (jobData: Partial<job>) => {
    const newJob: Partial<job> = {
      userId: userId,
      jobTitle: jobData.jobTitle || "",
      company: jobData.company || "",
      location: jobData.location || "Remote",
      jobLink: jobData.jobLink || "",
      status: jobData.status || "Apply",
      resumeId: jobData.resumeId || "",
      note: jobData.note || "",
    };

    try {
      await axiosInstance.post("/job/create", newJob);
      toast.success("Job added successfully")
      setShowAddJob(false);
    } catch (error) {
      toast.error("Uploading failed")
    }

  };

  const handleDeleteJob = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job application?")) {
      try {
        await axiosInstance.delete(`/job/${jobId}`);
        toast.success("Deleted successfully");
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const handleUpdateStatus = async (
    jobId: string,
    newStatus: job["status"]
  ) => {
    try {
      await axiosInstance.put(`/job/${jobId}`, { status: newStatus });
      toast.success("Updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    const matchesSearch =
      job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusColors = {
    Apply: "bg-gray-100 text-gray-700",
    Applied: "bg-blue-100 text-blue-700",
    Interview: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
    Selected: "bg-green-100 text-green-700",
  };

  const getStatusCounts = () => {
    return {
      total: jobs.length,
      apply: jobs.filter((j) => j.status === "Apply").length,
      applied: jobs.filter((j) => j.status === "Applied").length,
      interview: jobs.filter((j) => j.status === "Interview").length,
      selected: jobs.filter((j) => j.status === "Selected").length,
      rejected: jobs.filter((j) => j.status === "Rejected").length,
    };
  };

  const counts = getStatusCounts();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (jobs.length === 0) {
    return (
      <>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center mt-10">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-3">
              No Job Applications Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start tracking your job applications to stay organized and
              increase your chances of landing your dream job.
            </p>
            <button
              onClick={() => setShowAddJob(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-200"
            >
              Add Your First Job
            </button>
          </div>
        </div>

        {showAddJob && (
          <AddJobModal
            resumes={resumes}
            onAdd={handleAddJob}
            onClose={() => setShowAddJob(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="space-y-6 w-[80vw] mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-gray-600">
            <p className="text-xs text-gray-600 mb-1">Total</p>
            <p className="text-2xl text-gray-900">{counts.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-gray-400">
            <p className="text-xs text-gray-600 mb-1">To Apply</p>
            <p className="text-2xl text-gray-900">{counts.apply}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-600">
            <p className="text-xs text-gray-600 mb-1">Applied</p>
            <p className="text-2xl text-gray-900">{counts.applied}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-600">
            <p className="text-xs text-gray-600 mb-1">Interview</p>
            <p className="text-2xl text-gray-900">{counts.interview}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-600">
            <p className="text-xs text-gray-600 mb-1">Selected</p>
            <p className="text-2xl text-gray-900">{counts.selected}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-600">
            <p className="text-xs text-gray-600 mb-1">Rejected</p>
            <p className="text-2xl text-gray-900">{counts.rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs or companies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Apply">To Apply</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                onClick={() => setShowAddJob(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Add Job
              </button>
            </div>
          </div>
        </div>


          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900 mb-1">
                          {job.jobTitle}
                        </h3>
                        <p className="text-lg text-gray-700 mb-2">
                          {job.company}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Added {formatDate(job.createdAt)}</span>
                          </div>
                          {job.jobLink && (
                            <a
                              href={job.jobLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>View Posting</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <select
                      value={job.status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          job._id,
                          e.target.value as job["status"]
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm border-0 ${
                        statusColors[job.status]
                      }`}
                    >
                      <option value="Apply">To Apply</option>
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {job.resumeId && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>
                        Resume:{" "}
                        {resumes.find((r) => r._id === job.resumeId)?.name ||
                          "Unknown Resume"}
                      </span>
                    </div>
                  </div>
                )}

                {job.note && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Note:</span> {job.note}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Edit2 className="w-4 h-4" />
                    Edit Note
                  </button>
                </div>
              </div>
            ))}
          </div>
        

        {filteredJobs.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">
              No jobs found matching your filters.
            </p>
          </div>
        )}
      </div>

      {showAddJob && (
        <AddJobModal
          resumes={resumes}
          onAdd={handleAddJob}
          onClose={() => setShowAddJob(false)}
        />
      )}
    </>
  );
};

export default Job;
