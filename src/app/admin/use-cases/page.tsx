"use client";

import React from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { USE_CASES } from "@/data/use-cases";
import { Briefcase } from "lucide-react";

export default function AdminUseCasesPage() {
  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="Use Cases & Solutions Management"
          subtitle="Manage domain-specific AI execution templates and role-based playbooks."
        />

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Published Use Cases ({USE_CASES.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Target Role</th>
                  <th className="py-3 px-2">Recommended Tools</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {USE_CASES.map((uc) => (
                  <tr key={uc.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{uc.title}</td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400 capitalize">{uc.targetRole}</td>
                    <td className="py-3 px-2 text-slate-500">{uc.relatedTools?.length || 0} Tools</td>
                    <td className="py-3 px-2 text-right">
                      <Link href={`/use-cases/${uc.slug}`} target="_blank" className="text-indigo-600 hover:underline">
                        View ↗
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
