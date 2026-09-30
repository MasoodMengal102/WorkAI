import React from "react";
import { Metadata } from "next";
import { dataService } from "@/lib/db";
import { WorkflowCard } from "@/components/workflows/WorkflowCard";
import { TopAd, BottomAd } from "@/components/ads/AdSlot";
import { Layers } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Workflows Library (20+ Step-by-Step Plans)",
  description: "Browse 20+ sequential AI workflows. From YouTube videos and CV building to coding and research, discover actionable steps with verified free tools.",
};

export default async function WorkflowsIndexPage() {
  const workflows = await dataService.getWorkflows();

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>20+ Actionable AI Workflows</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Workflow Library
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Stop guessing tool combinations. Step-by-step sequential blueprints showing you exactly how to accomplish real outcomes with verified tools.
          </p>
        </div>

        <TopAd />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} />
          ))}
        </div>

        <BottomAd />
      </div>
    </div>
  );
}
