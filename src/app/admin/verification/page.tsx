"use client";

import React from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { TOOLS } from "@/data/tools";
import { CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";

export default function AdminVerificationPage() {
  const verifiedTools = TOOLS.filter((t) => t.verificationStatus === "VERIFIED");
  const reviewTools = TOOLS.filter((t) => t.verificationStatus !== "VERIFIED");

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="Data Verification & Provenance Queue"
          subtitle="Editorial fact-checking workflow: Inspect source links, pricing claims, and editorial review schedules."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-semibold">Total Verified Tools</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{verifiedTools.length}</p>
            <span className="text-slate-400 mt-1 block">100% Provenance Confirmed</span>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-semibold">Needs Review Queue</span>
            <p className="text-2xl font-black text-amber-500 mt-1">{reviewTools.length}</p>
            <span className="text-slate-400 mt-1 block">Scheduled for periodic audit</span>
          </div>
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 font-semibold">Verification Policy</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">90-Day Provenance Window</p>
            <span className="text-slate-400 mt-1 block">Manual human verification required</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Active Verification Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-2">Tool</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Source Type</th>
                  <th className="py-3 px-2">Source Link</th>
                  <th className="py-3 px-2">Last Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {TOOLS.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{t.name}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {t.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-500">{t.verificationSourceType}</td>
                    <td className="py-3 px-2">
                      <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                        <span>Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-3 px-2 text-slate-500">{t.lastVerifiedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
