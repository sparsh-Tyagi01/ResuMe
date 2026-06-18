import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, KeyRound, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    if (!name || !email || !phone || !password) {
      toast.error("All fields are required.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });

      if (res.status === 200 && res.data.token) {
        login(res.data.token, {
          id: res.data.payload.id,
          email: res.data.payload.email,
          role: res.data.payload.role,
        });
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration error: ", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center font-sans overflow-hidden px-4 py-12">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/40 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-100/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/50 text-slate-600 text-xs font-semibold mb-4 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            Get Started Free
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Build professional-quality resumes with our live layout builder.
          </p>
        </div>

        <div className="bg-white border border-slate-200/60 p-8 rounded-3xl shadow-xl shadow-slate-100/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-slate-900 text-sm font-medium placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-slate-900 text-sm font-medium placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone size={16} />
                </div>
                <input
                  type="tel"
                  id="phone"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-slate-900 text-sm font-medium placeholder-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all text-slate-900 text-sm font-medium placeholder-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-slate-900/10 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-xs">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-indigo-600 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline-block"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-6 py-2.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          ← Back to homepage
        </button>
      </motion.div>
    </div>
  );
};

export default Register;
