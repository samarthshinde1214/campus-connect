"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Mail,
  Lock,
  Loader2,
  ChevronLeft,
  ArrowRight,
  Crown,
  Sparkles,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/app/layout";
import { toast } from "sonner";

export default function PrincipalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const { setUser } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (data.user.role !== "principal")
        throw new Error("This portal is for Principal only");

      setUser(data.user);
      toast.success(`Welcome, ${data.user.name}`);
      window.location.href = "/principal/dashboard";
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const seedStaff = async () => {
    try {
      await fetch("/api/auth/staff-login");
      toast.success("All staff accounts created successfully!");
      setShowCredentials(true);
    } catch (e) {
      toast.error("Failed to create staff accounts");
    }
  };

  const credentials = [
    {
      role: "Principal",
      email: "principal@campusconnect.edu",
      password: "admin",
      color: "from-purple-600 to-fuchsia-600",
    },
    {
      role: "IT HOD",
      email: "hod_it@campusconnect.edu",
      password: "admin",
      color: "from-emerald-600 to-teal-600",
    },
    {
      role: "ENTC HOD",
      email: "hod_entc@campusconnect.edu",
      password: "admin",
      color: "from-emerald-600 to-teal-600",
    },
    {
      role: "Electrical HOD",
      email: "hod_elec@campusconnect.edu",
      password: "admin",
      color: "from-emerald-600 to-teal-600",
    },
    {
      role: "Mechanical HOD",
      email: "hod_mech@campusconnect.edu",
      password: "admin",
      color: "from-emerald-600 to-teal-600",
    },
    {
      role: "Civil HOD",
      email: "hod_civil@campusconnect.edu",
      password: "admin",
      color: "from-emerald-600 to-teal-600",
    },
    {
      role: "MCA HOD",
      email: "hod_mca@campusconnect.edu",
      password: "admin",
      color: "from-emerald-600 to-teal-600",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-fuchsia-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-purple-400/20 dark:text-purple-600/20"
        >
          <Crown size={140} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -12, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-20 text-fuchsia-400/20 dark:text-fuchsia-600/20"
        >
          <GraduationCap size={120} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-10 left-1/4 w-80 h-80 bg-gradient-to-br from-pink-500/30 to-rose-500/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-md mx-auto px-4 py-12">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-colors font-semibold"
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
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-fuchsia-500/10 to-transparent rounded-tr-full" />

          <div className="relative text-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/50 dark:shadow-purple-900/50"
            >
              <Crown className="text-white" size={40} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black mb-2"
            >
              <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                Principal Portal
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 dark:text-slate-400 font-medium flex items-center justify-center gap-2"
            >
              <Shield size={16} className="text-purple-500" />
              Executive Grievance Administration
              <Sparkles size={16} className="text-fuchsia-500" />
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="relative space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl">
                  <Mail className="text-white" size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Principal's Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 outline-none transition-all dark:text-white font-medium shadow-inner"
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-xl">
                  <Lock className="text-white" size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-fuchsia-500/30 focus:border-fuchsia-500 outline-none transition-all dark:text-white font-medium shadow-inner"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-purple-500/50 dark:shadow-purple-900/50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Crown size={20} />
                  Verify Identity
                  <ArrowRight size={24} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-slate-500 dark:text-slate-600 mt-6 font-medium"
        >
          🔒 Executive Access Only - Maximum Security Clearance
        </motion.p>
      </div>
    </div>
  );
}
