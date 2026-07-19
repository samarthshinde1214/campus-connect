"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
  ChevronLeft,
  ArrowRight,
  Shield,
  Award,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/app/layout";
import { toast } from "sonner";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

      setUser(data.user);
      toast.success(`Welcome, ${data.user.name}`);

      if (data.user.role === "hod") {
        window.location.href = "/hod/dashboard";
      } else {
        window.location.href = "/principal/dashboard";
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const seedStaff = async () => {
    try {
      await fetch("/api/auth/staff-login");
      toast.success("Staff seeded! (Pass: admin)");
    } catch (e) {}
  };

  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState([]);

  const handleSetup = async () => {
    try {
      const response = await fetch("/api/auth/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setup: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setCredentials(data.credentials);
      setShowCredentials(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-emerald-400/20 dark:text-emerald-600/20"
        >
          <ShieldCheck size={140} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-20 text-teal-400/20 dark:text-teal-600/20"
        >
          <Award size={120} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-10 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-md mx-auto px-4 py-12">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-8 transition-colors font-semibold"
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
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-tr-full" />

          <div className="relative text-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/50 dark:shadow-emerald-900/50"
            >
              <ShieldCheck className="text-white" size={40} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-black mb-2"
            >
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Staff Portal
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 dark:text-slate-400 font-medium flex items-center justify-center gap-2"
            >
              <Shield size={16} className="text-emerald-500" />
              HOD & Principal Administration
            </motion.p>
          </div>

          <form onSubmit={handleLogin} className="relative space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                  <Mail className="text-white" size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Official Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all dark:text-white font-medium shadow-inner"
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
                  <Lock className="text-white" size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-4 py-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 outline-none transition-all dark:text-white font-medium shadow-inner"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 shadow-xl shadow-emerald-500/50 dark:shadow-emerald-900/50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Sparkles size={20} />
                  Access Dashboard
                  <ArrowRight size={24} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-8 border-t-2 border-slate-100 dark:border-slate-700 text-center relative">
            <button
              onClick={handleSetup}
              className="text-xs font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-4 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              🔧 First time? Setup Admin Accounts
            </button>
          </div>
        </motion.div>

        {showCredentials && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-emerald-200 dark:border-emerald-900/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                <Shield size={24} className="text-emerald-600" />
                Admin Credentials Created
              </h3>
              <button
                onClick={() => setShowCredentials(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {credentials.map((cred, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${cred.color} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                      >
                        {cred.role.split(" ")[0].slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-sm">
                          {cred.role}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {cred.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Password
                      </p>
                      <p className="font-black text-emerald-600 dark:text-emerald-400 text-lg font-mono">
                        {cred.password}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50">
              <p className="text-xs text-emerald-800 dark:text-emerald-200 font-bold text-center flex items-center justify-center gap-2">
                <Sparkles size={14} />
                All accounts are ready! Use any credential above to login
              </p>
            </div>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-slate-500 dark:text-slate-600 mt-6 font-medium"
        >
          🔒 Authorized personnel only - All access logged
        </motion.p>
      </div>
    </div>
  );
}
