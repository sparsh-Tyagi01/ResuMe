import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { ArrowLeft, KeyRound } from "lucide-react";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes (300 seconds)
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (!email) {
      toast.error("Invalid state. Redirecting to sign up.");
      navigate("/register");
    }
  }, [email, navigate]);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Focus previous input
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || isResending) return;
    setIsResending(true);
    try {
      await axiosInstance.post("/auth/resend-otp", { email });
      setTimeLeft(300); // Reset countdown
      toast.success("New verification code sent!");
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await axiosInstance.post("/auth/verify-otp", {
        email,
        otp: code,
      });

      if (res.status === 200 && res.data.token) {
        login(res.data.token, {
          id: res.data.payload.id,
          email: res.data.payload.email,
          role: res.data.payload.role,
        });
        toast.success("Welcome to ResuMe!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      toast.error(err.response?.data?.message || "Invalid or expired verification code.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full min-h-screen bg-slate-50 font-sans">
      <button
        onClick={() => navigate("/register")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm"
      >
        <ArrowLeft size={16} /> Back to Sign Up
      </button>

      <div className="w-full max-w-md bg-white border border-slate-200/60 p-8 rounded-3xl shadow-xl shadow-slate-100/50 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
          <KeyRound size={24} />
        </div>

        <h2 className="text-2xl font-bold text-slate-950 mb-1">Verify Your Email</h2>
        <p className="text-slate-500 text-xs text-center mb-6 leading-relaxed">
          We sent a 6-digit verification code to <br />
          <strong className="text-slate-800">{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="w-full flex flex-col items-center gap-6">
          <div className="flex justify-between gap-2.5 w-full max-w-xs">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  if (el) inputRefs.current[idx] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="w-10 h-12 text-center text-xl font-bold bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl focus:outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-slate-900/10 cursor-pointer flex items-center justify-center gap-2"
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          {timeLeft > 0 ? (
            <p>
              Resend code in <strong className="text-slate-800">{formatTime(timeLeft)}</strong>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              {isResending ? "Resending..." : "Resend Verification Code"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
