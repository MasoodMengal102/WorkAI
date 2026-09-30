import React from "react";
import Link from "next/link";
import { WorkflowItem } from "@/types";
import { Clock, Layers, ArrowRight, UserCheck } from "lucide-react";
import { InlineMarkdown } from "@/components/content/MarkdownRenderer";

interface WorkflowCardProps {
  workflow: WorkflowItem;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const getDifficultyBadge = (difficulty: WorkflowItem["difficulty"]) => {
    switch (difficulty) {
      case "BEGINNER":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Beginner Friendly</span>;
      case "INTERMEDIATE":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">Intermediate</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">Advanced</span>;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {workflow.category}
          </span>
          {getDifficultyBadge(workflow.difficulty)}
        </div>

        <Link href={`/workflows/${workflow.slug}`} className="block mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {workflow.title}
          </h3>
        </Link>

        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          <InlineMarkdown text={workflow.description} />
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{workflow.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{workflow.steps.length} Sequenced Steps</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Updated: {workflow.lastReviewedAt}</span>
        <Link
          href={`/workflows/${workflow.slug}`}
          className="font-semibold text-xs text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 flex items-center gap-1"
        >
          <span>Open Full Action Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
