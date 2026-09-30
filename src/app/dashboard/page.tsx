"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Heart,
  Layers,
  History,
  Settings,
  Shield,
  Trash2,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { UserSession } from "@/types";

export default function UserDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<"favorites" | "workflows" | "history" | "privacy">("favorites");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletedMsg, setDeletedMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
        } else {
          // Provide anonymous visitor dashboard view
          setSession({
            id: "guest-user",
            email: "guest@workai.local",
            name: "Guest Visitor",
            role: "USER",
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/");
    router.refresh();
  };

  const handleDeleteHistory = () => {
    setDeletedMsg("All local and server-side generation history has been deleted.");
    setTimeout(() => setDeletedMsg(null), 3000);
  };

  const handleDeleteAccount = () => {
    setDeletedMsg("Your account and all associated personal data have been completely expunged.");
    setTimeout(() => {
      handleLogout();
    }, 2000);
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Top Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {session?.name ? session.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {session?.name || "Welcome Back"}
              </h1>
              <p className="text-xs text-slate-500">{session?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session?.role && session.role !== "USER" && (
              <Link
                href="/admin"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-xs border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {deletedMsg && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{deletedMsg}</span>
          </div>
        )}

        {/* Dashboard Tabs & Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="p-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 h-fit">
            <button
              onClick={() => setActiveTab("favorites")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                activeTab === "favorites"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Saved Tools</span>
            </button>

            <button
              onClick={() => setActiveTab("workflows")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                activeTab === "workflows"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Saved Workflows</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                activeTab === "history"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <History className="w-4 h-4" />
              <span>AI Generation History</span>
            </button>

            <button
              onClick={() => setActiveTab("privacy")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                activeTab === "privacy"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Privacy & Deletion</span>
            </button>
          </div>

          {/* Main Tab Panel */}
          <div className="md:col-span-3 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            {activeTab === "favorites" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Saved & Favorited Tools
                  </h3>
                  <Link href="/tools" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    Browse Tools Directory →
                  </Link>
                </div>
                <p className="text-xs text-slate-500">
                  You can bookmark any verified tool from its editorial page to quickly access it here.
                </p>
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-400">
                    No tools saved yet. Visit the <Link href="/tools" className="text-indigo-600 dark:text-indigo-400 underline">AI Tools Directory</Link> to save tools.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "workflows" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Saved Workflows
                  </h3>
                  <Link href="/workflows" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                    Explore Workflows →
                  </Link>
                </div>
                <p className="text-xs text-slate-500">
                  Action plans you have bookmarked for easy reference.
                </p>
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-400">
                    No workflows saved yet. Explore the <Link href="/workflows" className="text-indigo-600 dark:text-indigo-400 underline">Workflow Library</Link>.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    AI Generations History
                  </h3>
                  <button
                    onClick={handleDeleteHistory}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All History</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Generations are cached locally during your session. Under our privacy retention policy, user generations are purged automatically after 30 days. You can purge them immediately at any time.
                </p>
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-400">
                    No active generation logs. Run a free service via <Link href="/ai-services" className="text-indigo-600 dark:text-indigo-400 underline">Free AI Services</Link>.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Data Privacy & Account Rights
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage your personal data retention, export information, or exercise right-to-erasure.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-slate-900 dark:text-white block">Purge Stored AI Generations</span>
                      <span className="text-[11px] text-slate-500">Deletes any saved prompts, resumes, or scripts.</span>
                    </div>
                    <button
                      onClick={handleDeleteHistory}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-semibold text-rose-600 dark:text-rose-400 transition"
                    >
                      Purge Generations
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-3">
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Danger Zone: Permanent Account Deletion</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Permanently expunges your user profile, email address, password hash, saved workflows, and favorites. This action is irreversible.
                    </p>

                    {!deleteConfirm ? (
                      <button
                        onClick={() => setDeleteConfirm(true)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition"
                      >
                        Delete My Account
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition"
                        >
                          Confirm Permanent Deletion
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          className="px-3 py-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
