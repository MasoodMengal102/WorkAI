"use client";

import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { MessageSquare, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

export default function AdminFeedbackPage() {
  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="User Feedback & Editorial Corrections"
          subtitle="Review accuracy flags, user suggestions, and content improvement requests."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-semibold">Helpful Votes</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">98.4%</p>
            <span className="text-slate-400 mt-1 block">Positive editorial feedback</span>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-semibold">Flagged Data Reports</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">0 Pending</p>
            <span className="text-slate-400 mt-1 block">All flags addressed</span>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-semibold">Feedback Response Time</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">&lt; 24h</p>
            <span className="text-slate-400 mt-1 block">Editorial SLA</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Community Feedback Queue</span>
          </h2>
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Zero pending editorial flags or accuracy correction requests in the queue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
