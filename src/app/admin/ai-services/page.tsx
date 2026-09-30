"use client";

import React from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { AI_SERVICES } from "@/data/ai-services";
import { Sparkles } from "lucide-react";

export default function AdminAiServicesPage() {
  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="AI Services & Free Utility Gateways"
          subtitle="Configure rate ceilings, token limits, and prompt templates for client utilities."
        />

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Free AI Tools ({AI_SERVICES.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-2">Service Name</th>
                  <th className="py-3 px-2">Endpoint</th>
                  <th className="py-3 px-2">Inputs</th>
                  <th className="py-3 px-2">Token Ceiling</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {AI_SERVICES.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{s.name}</td>
                    <td className="py-3 px-2 font-mono text-[11px] text-slate-500">/ai-services/{s.slug}</td>
                    <td className="py-3 px-2 text-slate-500">{s.inputFields?.length || 0} parameters</td>
                    <td className="py-3 px-2 text-slate-500">{s.tokenCeiling || 2048} max tokens</td>
                    <td className="py-3 px-2 text-right">
                      <Link href={`/ai-services/${s.slug}`} target="_blank" className="text-indigo-600 hover:underline">
                        Test ↗
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
