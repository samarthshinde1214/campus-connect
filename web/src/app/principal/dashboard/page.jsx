"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  List,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Search,
  MessageSquare,
  Send,
  Loader2,
  User,
  BookOpen,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Crown,
} from "lucide-react";
import { useAuthStore } from "@/app/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function PrincipalDashboard() {
  const { user, logout } = useAuthStore();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const queryClient = useQueryClient();

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ["complaints-principal"],
    queryFn: async () => {
      const res = await fetch(`/api/complaints?role=principal`);
      const data = await res.json();
      return data.complaints;
    },
    enabled: !!user,
  });

  const updateComplaint = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["complaints-principal"]);
      toast.success("Action logged and resolution updated.");
      setSelectedComplaint(null);
    },
  });

  if (!user || user.role !== "principal") return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-fuchsia-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-fuchsia-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-400/30 to-rose-400/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-black mb-3">
              <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 rounded-2xl text-white shadow-2xl shadow-purple-500/50">
                  <Crown size={40} />
                </div>
                Principal Office
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-bold ml-1 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-500" />
              Central Administration & Resolution Command
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="px-10 py-4 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white rounded-2xl font-black text-lg flex items-center gap-3 shadow-2xl transition-all"
          >
            <LogOut size={22} /> Logout
          </motion.button>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <AlertTriangle size={140} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle size={28} />
                  <h3 className="text-2xl font-black">Escalated Priority</h3>
                </div>
                <p className="text-rose-100 text-sm mb-6 leading-relaxed">
                  These issues have exceeded the 3-day HOD resolution limit.
                </p>
                <div className="text-7xl font-black mb-2">
                  {complaints.length}
                </div>
                <p className="text-xs font-bold text-rose-200 uppercase tracking-widest">
                  Awaiting Decision
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border-2 border-white dark:border-slate-700"
            >
              <h4 className="font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 text-lg">
                <GraduationCap className="text-purple-600" size={24} />
                Administration Tools
              </h4>
              <div className="space-y-3">
                {[
                  "Issue Direct Order to HOD",
                  "Emergency Committee Meet",
                  "System Reports",
                ].map((tool, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:from-purple-50 hover:to-fuchsia-50 dark:hover:from-purple-950/30 dark:hover:to-fuchsia-950/30 transition-all text-left px-4 flex items-center justify-between border border-slate-200 dark:border-slate-700"
                  >
                    {tool}{" "}
                    <ChevronRight size={16} className="text-purple-600" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white dark:border-slate-700 min-h-[600px] flex flex-col overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <List className="text-purple-600" size={28} />
                  Escalated Grievances
                </h3>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm">
                    All Branches
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center py-20">
                    <Loader2
                      className="animate-spin text-purple-600 mb-4"
                      size={48}
                    />
                    <p className="text-slate-500 font-semibold">
                      Retrieving command center data...
                    </p>
                  </div>
                ) : complaints.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 px-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-xl"
                    >
                      <CheckCircle2 className="text-white" size={56} />
                    </motion.div>
                    <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                      Campus is Balanced
                    </h4>
                    <p className="text-slate-500 max-w-sm leading-relaxed">
                      No escalated grievances found. Department HODs are
                      maintaining resolution timelines efficiently.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {complaints.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        layoutId={c.id.toString()}
                        whileHover={{ scale: 1.01, y: -2 }}
                        className="group bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 hover:from-purple-50 hover:to-fuchsia-50 dark:hover:from-purple-950/30 dark:hover:to-fuchsia-950/30 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800 p-6 transition-all cursor-pointer shadow-md hover:shadow-xl"
                        onClick={() => setSelectedComplaint(c)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-4">
                            <div className="p-3 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl text-white shadow-lg">
                              <BookOpen size={24} />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                ID: CC-{c.id} | {c.branch} Dept
                              </span>
                              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                                {c.subject}
                              </h4>
                            </div>
                          </div>
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-[10px] font-black uppercase shadow-lg"
                          >
                            Auto-Escalated
                          </motion.span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 italic">
                          "{c.description}"
                        </p>
                        <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <User size={12} /> Student Raised{" "}
                            {new Date(c.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-purple-600 font-black group-hover:underline flex items-center gap-1">
                            Take Direct Action <ChevronRight size={14} />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
              className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden border-2 border-white dark:border-slate-700"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black text-purple-600 uppercase tracking-widest mb-1 block flex items-center gap-2">
                      <Crown size={14} />
                      Principal Review
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                      Resolution Center
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"
                  >
                    <AlertCircle className="rotate-45" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Student Branch
                    </p>
                    <p className="text-sm font-black dark:text-white">
                      {selectedComplaint.branch}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Issue Category
                    </p>
                    <p className="text-sm font-black dark:text-white">
                      {selectedComplaint.category}
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-black text-slate-900 dark:text-white mb-2">
                    Grievance Description
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 rounded-2xl italic border border-slate-200 dark:border-slate-700">
                    "{selectedComplaint.description}"
                  </p>
                </div>

                {selectedComplaint.hod_comments && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-900/30 rounded-2xl">
                    <p className="text-xs font-black text-blue-600 mb-1">
                      HOD PREVIOUS REMARKS
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {selectedComplaint.hod_comments}
                    </p>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const comment = new FormData(e.target).get("comment");
                    updateComplaint.mutate({
                      id: selectedComplaint.id,
                      principal_comments: comment,
                      status: "resolved",
                    });
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-900 dark:text-white">
                      Principal's Final Verdict
                    </label>
                    <textarea
                      name="comment"
                      required
                      rows={4}
                      placeholder="Enter final resolution orders or direct instructions..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-purple-500/30 outline-none text-sm transition-all dark:text-white shadow-sm"
                    />
                  </div>
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() =>
                        updateComplaint.mutate({
                          id: selectedComplaint.id,
                          is_urgent: true,
                        })
                      }
                      className="flex-1 py-4 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-2xl font-bold hover:from-rose-100 hover:to-pink-100 transition-all text-sm border-2 border-rose-200"
                    >
                      Mark as Urgent
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={updateComplaint.isLoading}
                      className="flex-[2] py-4 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-purple-300 dark:shadow-none transition-all disabled:opacity-50"
                    >
                      {updateComplaint.isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={20} /> Mark Final Resolved
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
