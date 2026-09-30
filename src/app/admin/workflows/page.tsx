"use client";

import React from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { WORKFLOWS } from "@/data/workflows";
import { Layers, ArrowRight } from "lucide-react";

export default function AdminWorkflowsPage() {
  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <AdminNav
          title="Workflow Content Administration"
          subtitle="Manage multi-step action blueprints, category tags, and tool associations."
        />

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Published Workflows ({WORKFLOWS.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Difficulty</th>
                  <th className="py-3 px-2">Est. Time</th>
                  <th className="py-3 px-2">Steps</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {WORKFLOWS.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">{w.title}</td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400 capitalize">{w.category}</td>
                    <td className="py-3 px-2 text-slate-600 dark:text-slate-400">{w.difficulty}</td>
                    <td className="py-3 px-2 text-slate-500">{w.estimatedTime}</td>
                    <td className="py-3 px-2 text-slate-500">{w.steps.length} Steps</td>
                    <td className="py-3 px-2 text-right">
                      <Link href={`/workflows/${w.slug}`} target="_blank" className="text-indigo-600 hover:underline">
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
