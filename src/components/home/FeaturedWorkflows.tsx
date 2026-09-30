import React from "react";
import Link from "next/link";
import { WORKFLOWS } from "@/data/workflows";
import { WorkflowCard } from "@/components/workflows/WorkflowCard";
import { ArrowRight, Layers } from "lucide-react";

export function FeaturedWorkflows() {
  const featured = WORKFLOWS.slice(0, 6);

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Step-by-Step Blueprints</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
              Popular AI Workflows
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Proven, sequential action plans connecting research, drafting, voice synthesis, and publishing with verified tools.
            </p>
          </div>
          <Link
            href="/workflows"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            <span>View All 20+ Workflows</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} />
          ))}
        </div>
      </div>
    </section>
  );
}
