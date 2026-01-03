import { LogIn, NotebookPen } from "lucide-react"

const Navbar = () => {
  return (
    <div className="w-screen flex justify-between items-center px-6 py-4 bg-slate-100/10 backdrop-blur-md backdrop-saturate-150 border border-slate-100/20 shadow-lg">
        <div className="flex justify-center items-center gap-2">
            <div className="text-blue-900 ">
                <NotebookPen size={40}/>
            </div>
            <div>
                <h1 className="text-xl">SmartResumeAI</h1>
                <p className="text-xs text-black/60">AI-Powered Career Platform</p>
            </div>
        </div>
        <div className="flex justify-center items-center gap-6">
            <div className="flex justify-center items-center gap-1 text-xl bg-green-700 px-4 py-1 rounded-[10px] text-white hover:bg-green-700 transition-colors duration-150 cursor-pointer">
                <LogIn className="text-yellow-400 font-extrabold"/>LogIn
            </div>
            <div className="bg-blue-900 px-4 py-2 rounded-[10px] text-white font-bold animate-pulse cursor-default">
                Get Started
            </div>
        </div>
    </div>
  )
}

export default Navbar