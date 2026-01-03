import { useEffect, useState } from "react";
import type { resume } from "../types/models";
import { axiosInstance } from "../lib/axios";
import { Calendar, Download, Edit, Eye, FileText, Trash2 } from "lucide-react";

const Resume = () => {

  const [resumes, setResumes] = useState<resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<resume | null>(null);

  useEffect(() => {
    async function getResume() {
      const res = await axiosInstance.get("/resume/myResume");
      setResumes(res.data);
    }
    getResume();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      const res = await axiosInstance.delete(`/resume/${resumeId}`)
      setResumes(res.data)
    }
  };

  if(resumes.length==0){
    return (
       <div className="bg-white rounded-xl shadow-sm p-12 text-center mt-12">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl text-gray-900 mb-3">No Resumes Yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first professional resume to get started with your job search.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-200">
            Create Your First Resume
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6  mt-10 w-[80vw]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600 mb-1">Total Resumes</p>
          <p className="text-3xl text-gray-900">{resumes.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
          <p className="text-sm text-gray-600 mb-1">Last Updated</p>
          <p className="text-3xl text-gray-900">
            {resumes.length > 0 ? formatDate(resumes[0].updatedAt) : "-"}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
          <p className="text-sm text-gray-600 mb-1">Total Skills</p>
          <p className="text-3xl text-gray-900">
            {resumes.reduce((acc, r) => acc + r.skills.length, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume)=> (
          <div key={resume._id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
          >
            <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
              <FileText className="w-20 h-20 text-blue-300" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setSelectedResume(resume)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg text-gray-900 mb-1">{resume.name}</h3>
                  <p className="text-sm text-gray-600">{resume.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Updated {formatDate(resume.updatedAt)}</span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {resume.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {resume.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{resume.skills.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resume._id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>



      {selectedResume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl text-gray-900">Resume Preview</h3>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button
                  onClick={() => setSelectedResume(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="mb-6">
                  <h1 className="text-3xl text-gray-900 mb-2">{selectedResume.name}</h1>
                  <div className="text-gray-600 space-y-1">
                    <p>{selectedResume.email} • {selectedResume.phone}</p>
                    {selectedResume.linkedin && <p>LinkedIn: {selectedResume.linkedin}</p>}
                    {selectedResume.github && <p>GitHub: {selectedResume.github}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedResume.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedResume.experience.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">Experience</h2>
                    <div className="space-y-4">
                      {selectedResume.experience.map((exp, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="text-lg text-gray-900">{exp.role}</h3>
                              <p className="text-gray-700">{exp.company}</p>
                            </div>
                            <p className="text-sm text-gray-600">{exp.duration}</p>
                          </div>
                          <p className="text-gray-700">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedResume.education.length > 0 && (
                  <div>
                    <h2 className="text-xl text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">Education</h2>
                    <div className="space-y-3">
                      {selectedResume.education.map((edu, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg text-gray-900">{edu.degree}</h3>
                              <p className="text-gray-700">{edu.institution}</p>
                            </div>
                            <p className="text-sm text-gray-600">{edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resume;
