import { ArrowLeft, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Register = () => {

    const navigate = useNavigate()

  return (
    <div className="flex flex-col justify-center items-center gap-2 w-full min-h-screen bg-slate-100">
        <div className="w-[35vw] flex items-center gap-2 text-black/60 mt-10 cursor-default" onClick={()=> navigate('/')}>
            <ArrowLeft/> Back to Home
        </div>
        <div className="w-[35vw] flex flex-col items-center gap-3 bg-white py-6 rounded-2xl shadow-xl mb-10">
            <div className="bg-gradient-to-br from-blue-800 to-cyan-700 rounded-[10px] p-2 text-white"><User size={40}/></div>
            <h1 className="text-2xl">Create Account</h1>
            <p className="text-black/60">Sign up to start building your resume</p>
            <form className="w-[30vw] text-black/70 flex flex-col gap-2">
                <div>
                    <label htmlFor="name" className="block">Full Name</label>
                    <input type="text" id="name" placeholder="🙎🏻‍♂️ Enter your name..." className="w-[30vw] focus:outline-none border-2 border-black/20 p-1 rounded-[10px]"/>
                </div>
                <div>
                    <label htmlFor="email" className="block">Email Address</label>
                    <input type="text" id="email" placeholder="📧 Enter your email..." className="w-[30vw] focus:outline-none border-2 border-black/20 p-1 rounded-[10px]"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block">Phone Number</label>
                    <input type="number" id="phone" placeholder="📞 Enter your phone no..." className="w-[30vw] no-spinner focus:outline-none border-2 border-black/20 p-1 rounded-[10px]"/>
                </div>
                <div>
                    <label htmlFor="password" className="block">Password</label>
                    <input type="text" id="password" placeholder="🔐 Create your password..." className="w-[30vw] focus:outline-none border-2 border-black/20 p-1 rounded-[10px]"/>
                </div>
                <div>
                    <label htmlFor="otp" className="block">OTP {"(one-time-password)"}</label>
                    <input type="number" id="otp" placeholder="🕐 Enter one-time-password..." className="w-[30vw] no-spinner focus:outline-none border-2 border-black/20 p-1 rounded-[10px]"/>
                </div>
                <button className="w-[30vw] mt-2 bg-gradient-to-r from-green-700 to-emerald-600 rounded-[5px] text-white py-1 hover:from-green-800 hover:to-emerald-700 transition-all duration-200 cursor-pointer">Create Account</button>
            </form>
            <h2 className="text-black/70">Already have an account? <span className="text-blue-600 font-medium cursor-default">Log in</span></h2>
            <p className="text-center text-xs text-black/50">By creating an account, you agree to our <span className="text-blue-500 cursor-pointer">Terms of Service</span> and<br/><span className="text-blue-500 cursor-pointer">Privacy Policy</span></p>
        </div>
    </div>
  )
}

export default Register