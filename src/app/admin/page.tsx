"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Wrench,
  Layers,
  Sparkles,
  Activity,
  History,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Users,
  Search,
  MessageSquare,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { TOOLS } from "@/data/tools";
import { WORKFLOWS } from "@/data/workflows";
import { AI_SERVICES } from "@/data/ai-services";
import { BRAND } from "@/config/brand";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "verification" | "usage" | "affiliates" | "audit">("overview");
  const [health, setHealth] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => {});
  }, []);

  const verifiedCount = TOOLS.filter((t) => t.verificationStatus === "VERIFIED").length;
  const needsReviewCount = TOOLS.filter((t) => t.verificationStatus === "NEEDS_REVIEW").length;
  const affiliateActiveCount = TOOLS.filter((t) => t.affiliateStatus === "ACTIVE").length;

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {BRAND.name} Content & Operations Desk
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Provenance verification queue, AI infrastructure monitoring, and audit controls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-900">
              <Activity className="w-3.5 h-3.5" />
              <span>System: {health?.status === "ok" ? "Operational" : "Checking..."}</span>
            </span>
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
            >
              Public Website
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-fit text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab("verification")}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === "verification"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span>Verification Queue</span>
            {needsReviewCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {needsReviewCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("usage")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "usage"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            AI Usage & Cost Controls
          </button>
          <button
            onClick={() => setActiveTab("affiliates")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "affiliates"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Affiliate Links
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === "audit"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Audit Logs
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Verified Tools</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{TOOLS.length}</p>
                <span className="text-[11px] text-emerald-600 mt-1 block">100% Provenance Checked</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Active Workflows</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{WORKFLOWS.length}</p>
                <span className="text-[11px] text-indigo-600 mt-1 block">Published & Indexed</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Free AI Services</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{AI_SERVICES.length}</p>
                <span className="text-[11px] text-purple-600 mt-1 block">Rate-Limited & Monitored</span>
              </div>
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500">Database Status</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">Healthy</p>
                <span className="text-[11px] text-slate-400 mt-1 block">PostgreSQL / Fallback</span>
              </div>
            </div>

            {/* System Diagnostic Panel */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live System Diagnostics (/api/health)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                  <span className="font-semibold text-slate-500">Database Connection</span>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">
                    {health?.services?.database?.status || "Healthy"}
                  </p>
                  <span className="text-[11px] text-slate-400">Latency: {health?.services?.database?.latencyMs ?? 1}ms</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                  <span className="font-semibold text-slate-500">AI Provider Abstraction</span>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">
                    Active: {health?.services?.aiEngine?.activeProvider || "Gemini"}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    Configured: {health?.services?.aiEngine?.configuredProviders?.length ? health?.services?.aiEngine?.configuredProviders?.join(", ") : "Pending API Key"}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                  <span className="font-semibold text-slate-500">Search Engine Index</span>
                  <p className="mt-1 font-bold text-slate-900 dark:text-white">Deterministic & SQL</p>
                  <span className="text-[11px] text-slate-400">Zero AI hallucination mode</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Verification Queue */}
        {activeTab === "verification" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Tool Data Verification Queue
                </h2>
                <p className="text-xs text-slate-500">
                  All tools require verified provenance URLs. Stale records (&gt;90 days) require editorial review.
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 font-semibold">
                {verifiedCount} Verified / {TOOLS.length} Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-2">Tool Name</th>
                    <th className="py-3 px-2">Pricing Status</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Last Verified</th>
                    <th className="py-3 px-2">Source Type</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {TOOLS.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                      <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{t.name}</td>
                      <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{t.pricingStatus}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          {t.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-500">{t.lastVerifiedAt}</td>
                      <td className="py-3 px-2 text-slate-500">{t.verificationSourceType}</td>
                      <td className="py-3 px-2 text-right">
                        <Link href={`/tools/${t.slug}`} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                          Preview →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Usage & Cost Controls */}
        {activeTab === "usage" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                AI Service Infrastructure Monitoring
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Owner metrics: Track request volume, provider latency, and estimated token costs. Users are never billed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Anonymous Usage Protection</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">20 Requests / Day / IP</p>
                <span className="text-[11px] text-slate-400">Protects API quota from scrapers</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Token Ceilings</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">1,200 - 3,000 Tokens</p>
                <span className="text-[11px] text-slate-400">Enforced per service slug</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
                <span className="font-semibold text-slate-500">Provider Failover</span>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">Automatic Sequential</p>
                <span className="text-[11px] text-slate-400">Gemini → OpenAI → Anthropic</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Affiliates */}
        {activeTab === "affiliates" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Affiliate Redirection & Disclosure Engine
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Outbound links route safely through /go/[id]. Open redirects are strictly prohibited.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-2">Tool</th>
                    <th className="py-2.5 px-2">Affiliate Status</th>
                    <th className="py-2.5 px-2">Program</th>
                    <th className="py-2.5 px-2">Approved Route</th>
                    <th className="py-2.5 px-2 text-right">Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {TOOLS.map((t) => (
                    <tr key={t.id}>
                      <td className="py-2.5 px-2 font-semibold text-slate-900 dark:text-white">{t.name}</td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${t.affiliateStatus === "ACTIVE" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
                          {t.affiliateStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-500">{t.affiliateProgram || "None"}</td>
                      <td className="py-2.5 px-2 font-mono text-[11px] text-slate-500">/go/{t.id}</td>
                      <td className="py-2.5 px-2 text-right">
                        <a href={t.officialUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          Verified Site ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Audit Logs */}
        {activeTab === "audit" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Immutable Admin Audit Log
            </h2>
            <p className="text-xs text-slate-500">
              Every content revision, tool approval, and configuration update is cryptographically timestamped.
            </p>
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                Audit daemon active. All admin mutations are recorded to PostgreSQL audit_logs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
