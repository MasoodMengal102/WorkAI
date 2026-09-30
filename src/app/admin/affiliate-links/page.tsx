"use client";

import React from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { TOOLS } from "@/data/tools";
import { DollarSign, ShieldAlert, ExternalLink } from "lucide-react";

export default function AdminAffiliateLinksPage() {
  const affiliateTools = TOOLS.filter((t) => t.affiliateStatus === "ACTIVE");

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="Affiliate Redirection & Disclosure Engine"
          subtitle="All affiliate links are routed through strict internal endpoints (/go/[id]) with FTC-compliant disclosure badges."
        />

        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-indigo-600 mt-0.5" />
          <span>
            Strict Anti-Open-Redirect Policy: Arbitrary external redirect targets are rejected at runtime. Only approved destination URLs in the official database are honored.
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-indigo-600" />
            <span>Active Affiliate Routes ({affiliateTools.length})</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-2">Tool</th>
                  <th className="py-3 px-2">Internal Route</th>
                  <th className="py-3 px-2">Program</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Destination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {affiliateTools.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{t.name}</td>
                    <td className="py-3 px-2 font-mono text-[11px] text-slate-500">/go/{t.id}</td>
                    <td className="py-3 px-2 text-slate-500">{t.affiliateProgram || "Standard"}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {t.affiliateStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <a href={t.officialUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        Verified URL ↗
                      </a>
                    </td>
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
