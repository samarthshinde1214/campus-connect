"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  ChevronLeft,
  BookOpen,
  Pencil,
  Lightbulb,
  Star,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/app/layout";
import { toast } from "sonner";

export default function StudentLogin() {
  const [loginMethod, setLoginMethod] = useState("phone"); // 'phone' or 'email'
  const [value, setValue] = useState("");
  const [step, setStep] = useState(1); // 1: input, 2: otp
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!value) return toast.error("Please enter your details");
    setLoading(true);
    // Mock OTP sending
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success("OTP sent successfully! (Try 123456)");
    }, 1000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [loginMethod === "phone" ? "mobile" : "email"]: value,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setUser(data.user);
      toast.success("Login Successful!");

      if (!data.user.profile_completed) {
        window.location.href = "/student/profile";
      } else {
        window.location.href = "/student/dashboard";
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-slate-950 dark:via-purple-950 dark:to-indigo-950">
      {/* Floating Study Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-blue-400/20 dark:text-blue-600/20"
        >
          <BookOpen size={120} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-20 text-purple-400/20 dark:text-purple-600/20"
        >
          <Pencil size={100} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-1/2 right-10 text-pink-400/20 dark:text-pink-600/20"
        >
          <Lightbulb size={90} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 right-1/3 text-yellow-400/30 dark:text-yellow-600/30"
        >
          <Star size={60} />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-40 left-20 text-emerald-400/20 dark:text-emerald-600/20"
        >
          <Sparkles size={80} />
        </motion.div>

        {/* Gradient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-10 left-1/4 w-80 h-80 bg-gradient-to-br from-pink-500/30 to-orange-500/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-md mx-auto px-4 py-12">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors font-semibold"
        >
          <ChevronLeft size={20} /> Back to Home
        </a>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border-2 border-white/50 dark:border-slate-700/50 relative overflow-hidden"
        >
          {/* Card Decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full" />

          <div className="relative text-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/50 dark:shadow-blue-900/50"
            >
              <BookOpen className="text-white" size={40} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black mb-2"
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Student Login
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 dark:text-slate-400 font-medium"
            >
              Welcome back, Scholar! ✨
            </motion.p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="flex bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-1.5 rounded-2xl shadow-inner">
                <button
                  type="button"
                  onClick={() => setLoginMethod("phone")}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${loginMethod === "phone" ? "bg-white dark:bg-slate-700 shadow-lg text-blue-600 scale-105" : "text-slate-500 dark:text-slate-400"}`}
                >
                  📱 Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${loginMethod === "email" ? "bg-white dark:bg-slate-700 shadow-lg text-purple-600 scale-105" : "text-slate-500 dark:text-slate-400"}`}
                >
                  ✉️ Email
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  {loginMethod === "phone" ? (
                    <Phone className="text-white" size={20} />
                  ) : (
                    <Mail className="text-white" size={20} />
                  )}
                </div>
                <input
                  type={loginMethod === "phone" ? "tel" : "email"}
                  placeholder={
                    loginMethod === "phone"
                      ? "Enter Mobile Number"
                      : "Enter Email ID"
                  }
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all dark:text-white font-medium text-lg shadow-inner"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/50 dark:shadow-blue-900/50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  "Send Magic Code"
                )}{" "}
                <ArrowRight size={24} />
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-8">
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium">
                  Enter the 6-digit code sent to
                  <br />
                  <span className="font-bold text-blue-600">{value}</span>
                </p>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.input
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                      type="text"
                      maxLength={1}
                      className="w-12 h-14 text-center text-2xl font-black bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 outline-none dark:text-white shadow-md"
                      required
                    />
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-purple-500/50 dark:shadow-purple-900/50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  "Verify & Enter Campus 🎓"
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
              >
                ← Change {loginMethod === "phone" ? "Mobile Number" : "Email"}
              </button>
            </form>
          )}
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-slate-500 dark:text-slate-600 mt-6 font-medium"
        >
          🔒 Your data is secure and encrypted
        </motion.p>
      </div>
    </div>
  );
}
