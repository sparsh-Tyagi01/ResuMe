import { useState } from "react";
import type { job, resume } from "../types/models";
import { Briefcase, X } from "lucide-react";

interface AddJobModalProps {
  resumes: resume[];
  onAdd: (job: Partial<job>) => void;
  onClose: () => void;
}

const AddJobModal = ({resumes, onAdd, onClose}: AddJobModalProps) => {

  const [formData, setFormData] = useState<Partial<job>>({
    jobTitle: '',
    company: '',
    location: 'Remote',
    jobLink: '',
    status: 'Apply',
    resumeId: resumes[0]?._id || '',
    note: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.jobTitle && formData.company) {
      onAdd(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-cyan-700 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl text-gray-900">Add Job Application</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Company *</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. TechCorp Inc."
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Remote, San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as job['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Apply">To Apply</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Job Link</label>
            <input
              type="url"
              value={formData.jobLink}
              onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://company.com/jobs/123"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Resume Used</label>
            <select
              value={formData.resumeId}
              onChange={(e) => setFormData({ ...formData, resumeId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {resumes.length === 0 ? (
                <option value="">No resumes available</option>
              ) : (
                resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.name} - {resume.email}
                  </option>
                ))
              )}
            </select>
            {resumes.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">
                Create a resume first to track which one you used for this application.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes about the job, interview prep, contact person, etc..."
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-200"
            >
              Add Job Application
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddJobModal