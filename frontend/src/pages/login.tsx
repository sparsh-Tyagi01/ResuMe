import { ArrowLeft, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Login = () => {

    const navigate = useNavigate()

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full min-h-screen bg-slate-100">
        <div className="w-[35vw] flex items-center gap-2 text-black/60 mt-10 cursor-default" onClick={()=> navigate('/')}>
            <ArrowLeft/> Back to Home
        </div>
        <div className="w-[35vw] flex flex-col items-center gap-3 bg-white py-6 rounded-2xl shadow-xl mb-10">
            <div className="bg-gradient-to-br from-blue-800 to-cyan-700 rounded-[10px] p-2 text-white"><User size={40}/></div>
            <h1 className="text-2xl">Welcome Back</h1>
            <p className="text-black/60">Log in to access your resume dashboard</p>
            <form className="w-[30vw] text-black/70 flex flex-col gap-4">
                <div>
                    <label htmlFor="email" className="block">Email Address</label>
                    <input type="text" id="email" placeholder="📧 Enter your email..." className="w-[30vw] focus:outline-none border-2 border-black/20 p-1 rounded-[10px] mt-2"/>
                </div>
                <div>
                    <label htmlFor="password" className="block">Password</label>
                    <input type="text" id="password" placeholder="🔐 Create your password..." className="w-[30vw] focus:outline-none border-2 border-black/20 p-1 rounded-[10px] mt-2"/>
                </div>

                <button className="w-[30vw] mt-2 bg-gradient-to-r from-green-700 to-emerald-600 rounded-[5px] text-white py-1 hover:from-green-800 hover:to-emerald-700 transition-all duration-200 cursor-pointer">Log In</button>
            </form>
            <button className="text-blue-600 text-sm">Forget password</button>
            <h2 className="text-black/70">Don't have an account? <span className="text-blue-600 font-medium cursor-default">Sign up</span></h2>
        </div>
    </div>
  )
}

export default Login