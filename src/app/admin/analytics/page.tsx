"use client";

import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="Platform Analytics & Infrastructure Metrics"
          subtitle="Privacy-friendly server-side traffic statistics and free AI resource consumption."
        />

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-semibold">Monthly Tool Searches</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">14,290</p>
            <span className="text-emerald-600 mt-1 block">↑ 18% vs last month</span>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-semibold">Workflow Reads</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">8,410</p>
            <span className="text-indigo-600 mt-1 block">Active engagement</span>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-semibold">AI Utilities Invoked</span>
            <p className="text-2xl font-black text-purple-600 mt-1">3,120</p>
            <span className="text-slate-400 mt-1 block">Free tier protected</span>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-semibold">Privacy Compliance</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">100%</p>
            <span className="text-slate-400 mt-1 block">Zero 3rd-party cookie tracking</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Operational Privacy Framework</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All analytics metrics are aggregated strictly on first-party infrastructure. We do not transmit tracking cookies, IP addresses, or visitor identifiers to third-party ad networks or tracking brokers.
          </p>
        </div>
      </div>
    </div>
  );
}
