"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  List,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  LogOut,
  Search,
  Filter,
  MessageSquare,
  Send,
  Loader2,
  ChevronLeft,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/app/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function HODDashboard() {
  const { user, logout } = useAuthStore();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ["complaints-hod", user?.branch],
    queryFn: async () => {
      const res = await fetch(`/api/complaints?role=hod&branch=${user.branch}`);
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
      queryClient.invalidateQueries(["complaints-hod"]);
      toast.success("Complaint updated successfully");
      setSelectedComplaint(null);
    },
  });

  const filteredComplaints = complaints.filter(
    (c) =>
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toString().includes(searchTerm),
  );

  const stats = {
    new: complaints.filter((c) => c.status === "submitted").length,
    active: complaints.filter((c) =>
      ["under_review", "in_progress"].includes(c.status),
    ).length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    escalated: complaints.filter((c) => c.status === "escalated").length,
  };

  if (!user || user.role !== "hod") return null;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl text-white shadow-xl">
                  <ShieldCheck size={32} />
                </div>
                {user.branch} HOD
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 ml-1 font-semibold flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-500" />
              Department Command & Resolution Center
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-rose-200 dark:shadow-none transition-all"
          >
            <LogOut size={20} /> Logout
          </motion.button>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "New Grievances",
              count: stats.new,
              color: "from-blue-500 to-cyan-500",
              icon: List,
            },
            {
              label: "Under Review",
              count: stats.active,
              color: "from-orange-500 to-yellow-500",
              icon: Clock,
            },
            {
              label: "Resolved",
              count: stats.resolved,
              color: "from-emerald-500 to-teal-500",
              icon: CheckCircle2,
            },
            {
              label: "Escalated",
              count: stats.escalated,
              color: "from-rose-500 to-pink-500",
              icon: AlertCircle,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border-2 border-white dark:border-slate-700"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">
                  {stat.label}
                </p>
                <div
                  className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                >
                  <stat.icon className="text-white" size={20} />
                </div>
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white">
                {stat.count}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white dark:border-slate-700 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 flex flex-col sm:flex-row justify-between gap-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <List size={20} className="text-emerald-600" /> Issue Backlog
                </h3>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search by ID or Subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/30 text-sm transition-all dark:text-white shadow-sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 text-slate-600 dark:text-slate-400 text-xs font-black uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Issue ID</th>
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <Loader2
                            className="animate-spin text-emerald-600 mx-auto"
                            size={40}
                          />
                        </td>
                      </tr>
                    ) : filteredComplaints.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-20 text-center text-slate-500 italic"
                        >
                          No issues found.
                        </td>
                      </tr>
                    ) : (
                      filteredComplaints.map((c) => (
                        <tr
                          key={c.id}
                          className="hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-xs font-bold text-emerald-600">
                            CC-{c.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                                <User size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  Student {c.student_id.slice(0, 5)}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Raised{" "}
                                  {new Date(c.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate max-w-[200px]">
                              {c.subject}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                c.status === "resolved"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : c.status === "escalated"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {c.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setSelectedComplaint(c)}
                              className="p-2 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                            >
                              <ChevronRight size={20} />
                            </motion.button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedComplaint ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white dark:border-slate-700 p-6 sticky top-24"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="text-emerald-500" size={18} />
                      Action Center
                    </h4>
                    <button
                      onClick={() => setSelectedComplaint(null)}
                      className="text-xs text-slate-400 hover:text-rose-500 font-bold uppercase"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-2">
                        Issue Description
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                        "{selectedComplaint.description}"
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Change Status
                      </label>
                      <select
                        defaultValue={selectedComplaint.status}
                        onChange={(e) =>
                          updateComplaint.mutate({
                            id: selectedComplaint.id,
                            status: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/30 outline-none text-sm transition-all dark:text-white shadow-sm"
                      >
                        <option value="submitted">New/Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Mark Resolved</option>
                      </select>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const comment = new FormData(e.target).get("comment");
                        updateComplaint.mutate({
                          id: selectedComplaint.id,
                          hod_comments: comment,
                        });
                      }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Official Comment
                      </label>
                      <textarea
                        name="comment"
                        defaultValue={selectedComplaint.hod_comments || ""}
                        rows={3}
                        placeholder="Add resolution details or instructions..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-emerald-500/30 outline-none text-sm transition-all dark:text-white shadow-sm"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={updateComplaint.isLoading}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg"
                      >
                        {updateComplaint.isLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <>
                            <MessageSquare size={18} /> Update & Save
                          </>
                        )}
                      </motion.button>
                    </form>

                    <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center bg-rose-50 dark:bg-rose-950/20">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-bold">
                        Auto-Escalation Timer
                      </p>
                      <div className="flex justify-center items-center gap-2 text-rose-600 font-black text-lg">
                        <Clock size={18} />
                        {Math.max(
                          0,
                          Math.ceil(
                            (new Date(selectedComplaint.escalation_deadline) -
                              new Date()) /
                              (1000 * 60 * 60 * 24),
                          ),
                        )}{" "}
                        Days Left
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden h-[400px]">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck size={160} />
                  </div>
                  <h4 className="text-2xl font-black mb-4 relative z-10">
                    Department Head Guidelines
                  </h4>
                  <ul className="space-y-4 relative z-10">
                    <li className="flex gap-3 text-emerald-100 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] shrink-0">
                        1
                      </div>
                      Resolve issues within 3 days to avoid auto-escalation.
                    </li>
                    <li className="flex gap-3 text-emerald-100 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] shrink-0">
                        2
                      </div>
                      Always add a descriptive comment when resolving.
                    </li>
                    <li className="flex gap-3 text-emerald-100 text-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-[10px] shrink-0">
                        3
                      </div>
                      Escalated issues move directly to Principal control.
                    </li>
                  </ul>
                  <div className="mt-12 p-4 bg-white/10 rounded-2xl border border-white/20 relative z-10 backdrop-blur-sm">
                    <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider mb-1 text-center">
                      Your Performance
                    </p>
                    <div className="flex justify-between items-center px-4">
                      <div className="text-center">
                        <p className="text-lg font-black">98%</p>
                        <p className="text-[10px] text-emerald-200">
                          Resolution
                        </p>
                      </div>
                      <div className="h-8 w-px bg-white/30" />
                      <div className="text-center">
                        <p className="text-lg font-black">1.2d</p>
                        <p className="text-[10px] text-emerald-200">
                          Avg Speed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
