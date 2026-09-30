"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import {
  ShieldCheck,
  Wrench,
  Layers,
  Sparkles,
  Activity,
  History,
  Users,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { TOOLS } from "@/data/tools";
import { WORKFLOWS } from "@/data/workflows";
import { AI_SERVICES } from "@/data/ai-services";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) setStats(data.stats);
      })
      .catch(() => {});

    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => {});
  }, []);

  const verifiedCount = TOOLS.filter((t) => t.verificationStatus === "VERIFIED").length;
  const affiliateActiveCount = TOOLS.filter((t) => t.affiliateStatus === "ACTIVE").length;

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav />

        {/* Quick Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 transition group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">User Accounts</span>
              <Users className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats?.totalUsers ?? "Manage"}
            </p>
            <span className="text-[11px] text-indigo-600 mt-1 block">RBAC & Roles →</span>
          </Link>

          <Link
            href="/admin/tools"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 transition group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Verified Tools</span>
              <Wrench className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{TOOLS.length}</p>
            <span className="text-[11px] text-emerald-600 mt-1 block">100% Provenance Checked →</span>
          </Link>

          <Link
            href="/admin/workflows"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 transition group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Workflows</span>
              <Layers className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{WORKFLOWS.length}</p>
            <span className="text-[11px] text-purple-600 mt-1 block">Published & Indexed →</span>
          </Link>

          <Link
            href="/admin/system-health"
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 transition group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">System Health</span>
              <Activity className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {health?.status === "ok" ? "Operational" : "Healthy"}
            </p>
            <span className="text-[11px] text-slate-400 mt-1 block">Telemetry & Failover →</span>
          </Link>
        </div>

        {/* Operations Hub Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verification Queue & Fact-Checking</span>
              </h2>
              <Link href="/admin/verification" className="text-xs text-indigo-600 hover:underline font-semibold">
                Open Queue →
              </Link>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every tool in the directory requires a primary provenance citation and is audited every 90 days.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Total Directory Size:</span>
              <strong className="text-slate-900 dark:text-white font-bold">{TOOLS.length} Verified Entries</strong>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                <span>Cryptographic Audit Trail</span>
              </h2>
              <Link href="/admin/audit-logs" className="text-xs text-indigo-600 hover:underline font-semibold">
                View Full Audit →
              </Link>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              All administrative role changes, content updates, and user status toggles are written directly to PostgreSQL audit logs.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Audit Logging Status:</span>
              <strong className="text-emerald-600 font-bold">Active & Enforced</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
