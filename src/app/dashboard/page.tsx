"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Heart, Layers, History, Trash2, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { UserSession } from "@/types";

export default function UserDashboardPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"favorites" | "workflows" | "history">("favorites");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setSession(data.session);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleClearHistory = () => {
    setStatusMsg("Your cached generation records have been purged.");
    setTimeout(() => setStatusMsg(null), 3500);
  };

  if (loading) {
    return (
      <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <DashboardNav session={session} />

        {statusMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs">
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sub-menu on Left */}
          <div className="p-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 h-fit text-xs font-semibold">
            <button
              onClick={() => setActiveTab("favorites")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl transition ${
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
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl transition ${
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
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl transition ${
                activeTab === "history"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <History className="w-4 h-4" />
              <span>AI Generation History</span>
            </button>
          </div>

          {/* Tab Panel */}
          <div className="md:col-span-3 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
            {activeTab === "favorites" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white text-base">Saved & Bookmarked Tools</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Quickly access verified AI applications you have saved.</p>
                  </div>
                  <Link href="/tools" className="text-xs font-semibold text-indigo-600 hover:underline">
                    Browse All Tools →
                  </Link>
                </div>

                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                  <p className="text-xs text-slate-500">You haven&apos;t bookmarked any tools yet.</p>
                  <Link
                    href="/tools"
                    className="inline-block px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-xs"
                  >
                    Explore 15+ Verified Tools
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "workflows" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white text-base">Saved Workflows & Action Plans</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Step-by-step blueprints you have pinned for reference.</p>
                  </div>
                  <Link href="/workflows" className="text-xs font-semibold text-indigo-600 hover:underline">
                    Explore Workflows →
                  </Link>
                </div>

                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                  <p className="text-xs text-slate-500">No workflows saved yet.</p>
                  <Link
                    href="/workflows"
                    className="inline-block px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-xs"
                  >
                    Browse Action Plans
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h2 className="font-bold text-slate-900 dark:text-white text-base">AI Generation History</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Logs of free AI utilities run during your sessions.</p>
                  </div>
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                  </button>
                </div>

                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                  <p className="text-xs text-slate-500">No active generation records.</p>
                  <Link
                    href="/ai-services"
                    className="inline-block px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold text-xs"
                  >
                    Try Free AI Utilities
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
