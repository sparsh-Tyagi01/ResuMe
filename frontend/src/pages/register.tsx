import { ArrowLeft, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: number | "";
    password: string;
  }>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [data, setData] = useState("");
  const [otp, setOtp] = useState("");
  const [isGenerate, setIsGenerate] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setIsGenerate(true)

      if (!data) {
        const res = await axiosInstance.post("/auth/register", formData);
        setData(res.data);
      } else {
        const res = await axiosInstance.post("/auth/verify-otp", otp);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.payload.id);
        localStorage.setItem("role", res.data.payload.role);

        if (res.status == 200 && res.data.token) {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("Register error: ", error)
      toast.error("Registeration failed!")
    } finally {
      if (!data) {
        setIsGenerate(false);
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 w-full min-h-screen bg-slate-100">
      <div
        className="w-[35vw] flex items-center gap-2 text-black/60 mt-10 cursor-default"
        onClick={() => navigate("/")}
      >
        <ArrowLeft /> Back to Home
      </div>
      <div className="w-[35vw] flex flex-col items-center gap-3 bg-white py-6 rounded-2xl shadow-xl mb-10">
        <div className="bg-gradient-to-br from-blue-800 to-cyan-700 rounded-[10px] p-2 text-white">
          <User size={40} />
        </div>
        <h1 className="text-2xl">Create Account</h1>
        <p className="text-black/60">Sign up to start building your resume</p>
        <form
          onSubmit={handleSubmit}
          className="w-[30vw] text-black/70 flex flex-col gap-2"
        >
          <div>
            <label htmlFor="name" className="block">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="🙎🏻‍♂️ Enter your name..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-[30vw] focus:outline-none border-2 border-black/20 p-1 rounded-[10px]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block">
              Email Address
            </label>
            <input
              type="text"
              id="email"
              placeholder="📧 Enter your email..."
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-[30vw] focus:outline-none border-2 border-black/20 p-1 rounded-[10px]"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block">
              Phone Number
            </label>
            <input
              type="number"
              id="phone"
              placeholder="📞 Enter your phone no..."
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: Number(e.target.value) })
              }
              className="w-[30vw] no-spinner focus:outline-none border-2 border-black/20 p-1 rounded-[10px]"
            />
          </div>
          <div>
            <label htmlFor="password" className="block">
              Password
            </label>
            <input
              type="text"
              id="password"
              placeholder="🔐 Create your password..."
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-[30vw] focus:outline-none border-2 border-black/20 p-1 rounded-[10px]"
            />
          </div>
          {data && (
            <div>
              <label htmlFor="otp" className="block">
                OTP {"(one-time-password)"}
              </label>
              <input
                type="number"
                id="otp"
                placeholder="🕐 Enter one-time-password..."
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-[30vw] no-spinner focus:outline-none border-2 border-black/20 p-1 rounded-[10px]"
              />
            </div>
          )}

          {isGenerate ? (
            <button
            type="submit"
            className="w-[30vw] mt-2 bg-gradient-to-r from-green-700 to-emerald-600 rounded-[5px] text-white py-1 hover:from-green-800 hover:to-emerald-700 transition-all duration-200 cursor-pointer"
          >
            Generating...
          </button>
          ) : (
            <button
            type="submit"
            className="w-[30vw] mt-2 bg-gradient-to-r from-green-700 to-emerald-600 rounded-[5px] text-white py-1 hover:from-green-800 hover:to-emerald-700 transition-all duration-200 cursor-pointer"
          >
            {data ? "Create Account" : "Generate OTP"}
          </button>
          )}
        
        </form>
        <h2 className="text-black/70">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-medium cursor-default"
          >
            Log in
          </span>
        </h2>
        <p className="text-center text-xs text-black/50">
          By creating an account, you agree to our{" "}
          <span className="text-blue-500 cursor-pointer">Terms of Service</span>{" "}
          and
          <br />
          <span className="text-blue-500 cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
