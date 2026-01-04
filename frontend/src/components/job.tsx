import { useEffect, useState } from "react"
import { type job, type resume } from "../types/models"
import { axiosInstance } from "../lib/axios"
import { Briefcase } from "lucide-react"

const Job = () => {

  const [jobs, setJobs] = useState<job[]>([])
  const [resumes, setResumes] = useState<resume[]>([])
  const [showAddJob, setShowAddJob] = useState<boolean>(false);

  useEffect(()=>{
    async function getJob() {
      const res = await axiosInstance.get("/job/myResume")
      setJobs(res.data)
    }
    getJob()

    async function getResume() {
      const res = await axiosInstance.get("/resume/myResume");
      setResumes(res.data);
    }
    getResume();
  },[])

    const handleAddJob = async (jobData: Partial<job>) => {
    const newJob: job = {
      _id: Date.now().toString(),
      userId: user._id,
      jobTitle: jobData.jobTitle || '',
      company: jobData.company || '',
      location: jobData.location || 'Remote',
      jobLink: jobData.jobLink || '',
      status: jobData.status || 'Apply',
      resumeId: jobData.resumeId || '',
      note: jobData.note || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In production: POST /api/jobs
    setJobs([newJob, ...jobs]);
    const res = await axiosInstance.post("/job/create", newJob)
    setShowAddJob(false);
  };

  if (jobs.length === 0) {
    return (
      <>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center mt-10">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl text-gray-900 mb-3">No Job Applications Yet</h3>
            <p className="text-gray-600 mb-6">
              Start tracking your job applications to stay organized and increase your chances of landing your dream job.
            </p>
            <button
              onClick={() => setShowAddJob(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-700 to-cyan-700 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-200"
            >
              Add Your First Job
            </button>
          </div>
        </div>

        {/* {showAddJob && (
          <AddJobModal
            resumes={resumes}
            onAdd={handleAddJob}
            onClose={() => setShowAddJob(false)}
          />
        )} */}
      </>
    );
  }

  return (
    <div className="space-y-6 w-[80vw] mt-10">

    </div>
  )
}

export default Job