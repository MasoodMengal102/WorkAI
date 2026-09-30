"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { TOOLS } from "@/data/tools";
import { Wrench, CheckCircle2, AlertCircle, ExternalLink, Search } from "lucide-react";

export default function AdminToolsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = TOOLS.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="AI Tools Directory Management"
          subtitle="Manage verified tools, editorial metadata, pricing states, and provenance links."
        />

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-slate-500 font-semibold">{filteredTools.length} Tools</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-2">Tool Name</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Pricing Status</th>
                  <th className="py-3 px-2">Verification</th>
                  <th className="py-3 px-2">Verified At</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTools.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{t.name}</td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400 capitalize">{t.category}</td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{t.pricingStatus}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {t.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-500">{t.lastVerifiedAt}</td>
                    <td className="py-3 px-2 text-right">
                      <Link href={`/tools/${t.slug}`} target="_blank" className="text-indigo-600 hover:underline">
                        View Page ↗
                      </Link>
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
