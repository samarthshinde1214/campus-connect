"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  List,
  User,
  PieChart,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  LogOut,
  Image as ImageIcon,
  FileText,
  ChevronLeft,
  Calendar,
  Loader2,
  Hash,
  Mail,
  Phone,
  BookOpen,
} from "lucide-react";
import { useAuthStore } from "@/app/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const StatCard = ({ title, count, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-3xl shadow-xl border-2 border-white dark:border-slate-700"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2">
          {count}
        </h3>
      </div>
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 shadow-lg`}
      >
        <Icon className={color.replace("bg-", "text-")} size={28} />
      </motion.div>
    </div>
  </motion.div>
);

const ComplaintItem = ({ complaint, onClick }) => {
  const statusColors = {
    submitted: "bg-blue-100 text-blue-700",
    under_review: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-orange-100 text-orange-700",
    resolved: "bg-emerald-100 text-emerald-700",
    escalated: "bg-rose-100 text-rose-700",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick(complaint)}
      className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[complaint.status]}`}
        >
          {complaint.status.replace("_", " ")}
        </span>
        <span className="text-xs text-slate-400">#{complaint.id}</span>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-white mb-1 truncate">
        {complaint.subject}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
        {complaint.description}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar size={12} />{" "}
          {new Date(complaint.created_at).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          Assigned: {complaint.branch} HOD
        </span>
      </div>
    </motion.div>
  );
};

export default function StudentDashboard() {
  const { user, logout } = useAuthStore();
  const [view, setView] = useState("dashboard");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const queryClient = useQueryClient();

  const { data: complaints = [], isLoading } = useQuery({
    queryKey: ["complaints", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/complaints?role=student&userId=${user.id}`);
      const data = await res.json();
      return data.complaints;
    },
    enabled: !!user,
  });

  const stats = {
    total: complaints.length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    pending: complaints.filter(
      (c) => c.status !== "resolved" && c.status !== "escalated",
    ).length,
    escalated: complaints.filter((c) => c.status === "escalated").length,
  };

  const categories = [
    "Academic Issues",
    "Infrastructure",
    "Lab & Equipment",
    "Fees & Scholarship",
    "Faculty Issues",
    "Facilities",
    "Discipline & Safety",
  ];

  const createComplaint = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          student_id: user.id,
          branch: user.branch,
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["complaints"]);
      toast.success("Complaint submitted successfully!");
      setView("dashboard");
    },
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 space-y-2">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-blue-600" />
            </div>
            <div className="text-center">
              <h2 className="font-bold text-slate-900 dark:text-white truncate">
                {user.name}
              </h2>
              <p className="text-xs text-slate-500">{user.roll_number}</p>
              <p className="text-xs font-semibold text-blue-600 mt-1">
                {user.branch} | {user.year} Year
              </p>
            </div>
          </div>

          {[
            { id: "dashboard", label: "Dashboard", icon: PieChart },
            { id: "raise", label: "Raise Complaint", icon: Plus },
            { id: "list", label: "My Complaints", icon: List },
            { id: "profile", label: "Profile", icon: User },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setSelectedComplaint(null);
              }}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all ${view === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all mt-10"
          >
            <LogOut size={20} /> Logout
          </button>
        </aside>

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {view === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Submitted"
                    count={stats.total}
                    icon={FileText}
                    color="bg-blue-500"
                  />
                  <StatCard
                    title="In Progress"
                    count={stats.pending}
                    icon={Clock}
                    color="bg-orange-500"
                  />
                  <StatCard
                    title="Resolved"
                    count={stats.resolved}
                    icon={CheckCircle2}
                    color="bg-emerald-500"
                  />
                  <StatCard
                    title="Escalated"
                    count={stats.escalated}
                    icon={AlertCircle}
                    color="bg-rose-500"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="text-blue-600" size={24} /> Recent
                      Activities
                    </h3>
                    <button
                      onClick={() => setView("list")}
                      className="text-blue-600 text-sm font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  {isLoading ? (
                    <div className="py-12 flex justify-center">
                      <Loader2 className="animate-spin text-blue-600" />
                    </div>
                  ) : complaints.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                      No complaints raised yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {complaints.slice(0, 4).map((c) => (
                        <ComplaintItem
                          key={c.id}
                          complaint={c}
                          onClick={(comp) => {
                            setSelectedComplaint(comp);
                            setView("list");
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === "raise" && (
              <motion.div
                key="raise"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Raise New Complaint
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      createComplaint.mutate(Object.fromEntries(formData));
                    }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Category
                      </label>
                      <select
                        name="category"
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Subject
                      </label>
                      <input
                        name="subject"
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        placeholder="Brief subject of the issue"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Description
                      </label>
                      <textarea
                        name="description"
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                        placeholder="Describe your issue in detail..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Attachment (Optional)
                      </label>
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer group">
                        <ImageIcon
                          className="mx-auto text-slate-400 mb-2 group-hover:text-blue-500 transition-colors"
                          size={32}
                        />
                        <p className="text-sm text-slate-500">
                          Click to upload photo or document
                        </p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={createComplaint.isLoading}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {createComplaint.isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Send size={20} /> Submit Complaint
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {view === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {selectedComplaint ? (
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => setSelectedComplaint(null)}
                      className="flex items-center gap-2 text-blue-600 mb-6 font-semibold"
                    >
                      <ChevronLeft size={18} /> Back to list
                    </button>
                    <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
                      <div>
                        <span className="text-xs text-slate-400 font-mono mb-1 block">
                          ISSUE ID: CC-{selectedComplaint.id}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedComplaint.subject}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Status</p>
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                            selectedComplaint.status === "resolved"
                              ? "bg-emerald-100 text-emerald-700"
                              : selectedComplaint.status === "escalated"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {selectedComplaint.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Issue Details
                          </h4>
                          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-700 dark:text-slate-300">
                            <p className="font-semibold mb-1 text-slate-900 dark:text-white">
                              {selectedComplaint.category}
                            </p>
                            <p>{selectedComplaint.description}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Resolution Timeline
                          </h4>
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                                <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700" />
                              </div>
                              <div className="pb-4">
                                <p className="text-sm font-bold dark:text-white">
                                  Submitted
                                </p>
                                <p className="text-xs text-slate-500">
                                  {new Date(
                                    selectedComplaint.created_at,
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-4 h-4 rounded-full ${selectedComplaint.status !== "submitted" ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`}
                                />
                                <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700" />
                              </div>
                              <div className="pb-4">
                                <p className="text-sm font-bold dark:text-white">
                                  Under Review
                                </p>
                                <p className="text-xs text-slate-500">
                                  Department processing
                                </p>
                              </div>
                            </div>
                            {selectedComplaint.status === "escalated" && (
                              <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse" />
                                </div>
                                <div className="pb-4">
                                  <p className="text-sm font-bold text-rose-600">
                                    Escalated to Principal
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Auto-escalated after 3 days
                                  </p>
                                </div>
                              </div>
                            )}
                            {selectedComplaint.status === "resolved" && (
                              <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-4 h-4 rounded-full bg-emerald-500" />
                                </div>
                                <div className="pb-4">
                                  <p className="text-sm font-bold text-emerald-600">
                                    Resolved
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Grievance closed
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Official Response
                          </h4>
                          <div className="space-y-4">
                            {selectedComplaint.hod_comments ? (
                              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
                                <p className="text-xs font-bold text-blue-600 mb-1">
                                  HOD COMMENTS
                                </p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  {selectedComplaint.hod_comments}
                                </p>
                              </div>
                            ) : (
                              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl italic text-slate-500 text-sm">
                                Waiting for HOD response...
                              </div>
                            )}

                            {selectedComplaint.principal_comments && (
                              <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl">
                                <p className="text-xs font-bold text-purple-600 mb-1">
                                  PRINCIPAL COMMENTS
                                </p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  {selectedComplaint.principal_comments}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200 dark:shadow-none">
                          <h5 className="font-bold flex items-center gap-2 mb-2">
                            <Clock size={18} className="text-blue-400" />{" "}
                            Resolution Target
                          </h5>
                          <p className="text-sm text-slate-400">
                            Standard resolution time is 3 working days. Your
                            case is being tracked by the system.
                          </p>
                          <div className="mt-4 pt-4 border-t border-slate-800">
                            <p className="text-xs text-slate-500">
                              Deadline:{" "}
                              {new Date(
                                selectedComplaint.escalation_deadline,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        My Grievances
                      </h3>
                      <button
                        onClick={() => setView("raise")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all"
                      >
                        <Plus size={20} /> New
                      </button>
                    </div>
                    {isLoading ? (
                      <div className="py-20 flex justify-center">
                        <Loader2
                          className="animate-spin text-blue-600"
                          size={40}
                        />
                      </div>
                    ) : complaints.length === 0 ? (
                      <div className="bg-white dark:bg-slate-800 p-20 text-center rounded-3xl border border-slate-100 dark:border-slate-700">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                          <AlertCircle size={40} />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          No complaints found
                        </h4>
                        <p className="text-slate-500">
                          Everything looks quiet. Your grievances will appear
                          here.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {complaints.map((c) => (
                          <ComplaintItem
                            key={c.id}
                            complaint={c}
                            onClick={setSelectedComplaint}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {view === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Profile Details
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: "Full Name", value: user.name, icon: User },
                      {
                        label: "Roll Number",
                        value: user.roll_number,
                        icon: Hash,
                      },
                      { label: "Email", value: user.email, icon: Mail },
                      { label: "Mobile", value: user.mobile, icon: Phone },
                      { label: "Branch", value: user.branch, icon: BookOpen },
                      { label: "Year", value: user.year, icon: Calendar },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700"
                      >
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-blue-600 shadow-sm">
                          <row.icon size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                            {row.label}
                          </p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">
                            {row.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
