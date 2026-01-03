import { Badge, Book, Check, FastForward, Medal, NotebookPen, School, Star, TrendingUp, Users, type LucideIcon } from "lucide-react"

interface feature  {
    icon : LucideIcon;
    iconBg: string;
    borderColor: string;
    heading: string;
    content: string;
}

interface work {
    id: number;
    heading: string;
    bgColor: string;
    content: string;
}

const Homepage = () => {

    const features : feature[] = [
        {
            icon: Star,
            iconBg: "bg-blue-500",
            borderColor: "border-blue-500",
            heading: "AI Content Generator",
            content: "Get intelligent suggestions to improve your resume content. Our AI analyzes your experience and suggests compelling descriptions."
        },
        {
            icon: Book,
            iconBg: "bg-violet-500",
            borderColor: "border-violet-600",
            heading: "Professional Templates",
            content: "Choose from multiple beautifully designed templates. Modern, Classic, and Minimal styles to match your industry."
        },
        {
            icon: School,
            iconBg: "bg-green-500",
            borderColor: "border-green-500",
            heading: "Smart Job Matching",
            content: "Find jobs that match your skills with AI-powered scoring. Know exactly how well you fit each position."
        },
        {
            icon: TrendingUp,
            iconBg: "bg-orange-500",
            borderColor: "border-orange-600",
            heading: "Application Tracker",
            content: "Track all your job applications in one place. Monitor status from applied to interview to offer."
        },
        {
            icon: FastForward,
            iconBg: "bg-pink-500",
            borderColor: "border-pink-600",
            heading: "Quick Resume Builder",
            content: "Create professional resumes in minutes. Easy-to-use interface with step-by-step guidance."
        },
        {
            icon: Badge,
            iconBg: "bg-blue-800",
            borderColor: "border-blue-800",
            heading: "Skills Gap Analysis",
            content: "Identify skills you need to learn for your target jobs. Get personalized recommendations."
        }
    ]

    const works : work[] = [
        {
            id: 1,
            heading: "Choose a Template",
            bgColor: "bg-gradient-to-br from-violet-800 to-violet-600",
            content: "Select from our professional templates and customize the design to match your style and industry."
        },
        {
            id: 2,
            heading: "Create Your Resume",
            bgColor: "bg-gradient-to-br from-pink-800 to-pink-600",
            content: "Fill in your details using our intuitive form. Add your experience, education, and skills with AI-powered suggestions."
        },
        {
            id: 3,
            heading: "Find Perfect Jobs",
            bgColor: "bg-gradient-to-br from-red-800 to-violet-600",
            content: "Get AI-matched job recommendations with detailed scoring. Apply and track your applications all in one place."
        }
    ]

  return (
    <div className="w-full">
        <div className="bg-slate-100 w-full h-auto py-20 flex flex-col justify-center items-center pt-24">
            <h1 className="text-6xl">Land Your Dream Job With <span className="bg-blue-900 bg-clip-text text-black/0 font-extrabold">AI-</span></h1>
            <h1 className="text-6xl bg-gradient-to-r from-blue-900 to-green-800 bg-clip-text text-black/0 font-extrabold">Powered Resumes</h1>
            <div className="flex flex-col justify-center items-center text-black/60 mt-10 text-xl">
                <p>Create professional resumes in minutes, get AI powered content</p>
                <p>suggestions, and find jobs that perfectly match your skills. All in one</p>
                <p>platform.</p>
            </div>
            <div>
                <button className="px-6 py-3 rounded-[10px] bg-gradient-to-r from-blue-800 to-violet-800 text-white hover:from-blue-900 hover:to-violet-900 transition-all duration-150 shadow-blue-200 shadow-xl">Create Your Resume Free</button>
                <button className="border-2 border-black/30 rounded-[10px] py-3 px-4 ml-4 mt-10 hover:border-black/50 transition-all duration-150">Watch Demo</button>
            </div>
            <ul className="flex justify-evenly items-center gap-4 mt-10">
                <li className="flex justify-center items-center gap-1 text-xs"><Check className="text-green-600"/>No Credit Card Required</li>
                <li className="flex justify-center items-center gap-1 text-xs"><Check className="text-green-600"/>Free Templates</li>
                <li className="flex justify-center items-center gap-1 text-xs"><Check className="text-green-600"/>AI-Powered</li>
            </ul>
            <div className="mt-10 flex justify-evenly items-center gap-8">
                <div className="w-[25vw] min-h-[220px] bg-white rounded-2xl flex flex-col justify-center items-center shadow-2xl">
                    <Users size={60} className="rounded-full bg-blue-300 text-blue-700 p-2"/>
                    <h1 className="text-2xl mt-1">50,000+</h1>
                    <p className="text-black/60">Active Users</p>
                </div>
                <div className="w-[25vw] min-h-[220px] bg-white rounded-2xl flex flex-col justify-center items-center shadow-2xl">
                    <NotebookPen size={60} className="rounded-full bg-violet-300 text-violet-700 p-2"/>
                    <h1 className="text-2xl mt-1">100,000+</h1>
                    <p className="text-black/60">Resumes Created</p>
                </div>
                <div className="w-[25vw] min-h-[220px] bg-white rounded-2xl flex flex-col justify-center items-center shadow-2xl">
                    <Medal size={60} className="rounded-full bg-green-300 text-green-700 p-2"/>
                    <h1 className="text-2xl mt-1">85%</h1>
                    <p className="text-black/60">Success Rate</p>
                </div>
            </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center py-24">
            <h1 className="text-4xl text-black/80">
                Everything You Need to Succeed
            </h1>
            <p className="text-xl text-black/60 mt-4">
                Powerful features to help you create standout resumes and land your dream job
            </p>
            <div className="flex justify-evenly items-center gap-8 flex-wrap w-[80vw] mt-14">
                {features.map((i)=>(
                <div key={Date.now()} className={`w-[25vw] h-[30vh] rounded-2xl flex flex-col justify-center items-start gap-2 hover:border-2 hover:shadow shadow-[2px_2px_2px_gray] ${i.borderColor} transition-all duration-150 px-4`}>
                    
                        <div className={`${i.iconBg} p-2 rounded-[8px] text-white`}>
                            <i.icon size={35}/>
                        </div>
                        <h1 className="text-xl">
                            {i.heading}
                        </h1>
                        <p className="text-black/70 text-sm">
                            {i.content}
                        </p>
                    
                </div>
            ))}
            </div>
            <h1 className="mt-24 text-4xl text-black/80">
                How It Works
            </h1>
            <p className="mt-4 text-xl text-black/60">
                Get started in 3 simple steps
            </p>
            <div className="flex justify-evenly items-center w-[80vw] gap-4 mt-20">
                {works.map((i)=>(
                    <div key={i.id} className="flex flex-col items-center justify-center gap-2">
                        <div className={`text-xl text-white w-16 h-16 rounded-[100%] ${i.bgColor} flex justify-center items-center`}>{i.id}</div>
                        <h1 className="text-xl text-black/80">{i.heading}</h1>
                        <p className="text-black/60 text-center">{i.content}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="w-full py-20 bg-gradient-to-r from-blue-900 to-cyan-800 text-white flex flex-col justify-center items-center">
            <h1 className="text-4xl">Ready to Land Your Dream Job?</h1>
            <p className="text-white/60 text-xl my-6 text-center">Join thousands of job seekers who have successfully created professional resumes and found <br/> their perfect jobs.</p>
            <button className="block cursor-pointer px-6 py-4 rounded-[10px] bg-white text-blue-600 mt-6 hover:scale-105 transition-all duration-200">Start Building Your Resume</button>
        </div>
    </div>
  )
}

export default Homepage