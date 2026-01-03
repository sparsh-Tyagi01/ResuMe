import { AppWindow, School } from 'lucide-react'
import { useState } from 'react'
import Resume from './resume'
import Job from './job'

type Mode = "resume" | "job"

const Dashboard = () => {

  const [mode, setMode] = useState<Mode>("resume")

  return (
    <div className='flex flex-col items-center w-full'>
        <div className='pl-4 flex items-center gap-6 w-[80vw] mt-10 shadow-md rounded-[10px]'>
            <div 
            className={`flex justify-center items-center gap-1 text-black/60 h-12 cursor-default ${mode=="resume" && "border-b-2 border-blue-700 text-blue-600"}`}
            onClick={()=> setMode("resume")}
            >
              <AppWindow/> My Resumes
            </div>
            <div 
            className={`flex justify-center items-center gap-1 text-black/60 h-12 cursor-default ${mode=="job" && "border-b-2 border-blue-700 text-blue-600"}`}
            onClick={()=> setMode("job")}
            >
              <School/> Job Applications
            </div>
        </div>
        {mode==="resume" ? <Resume/> : <Job/>}
    </div>
  )
}

export default Dashboard