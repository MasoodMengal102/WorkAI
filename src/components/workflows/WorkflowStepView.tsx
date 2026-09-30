"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WorkflowStepItem } from "@/types";
import { InlineMarkdown } from "@/components/content/MarkdownRenderer";
import { Clock, Check, Copy, ExternalLink, Sparkles, HelpCircle } from "lucide-react";

interface WorkflowStepViewProps {
  step: WorkflowStepItem;
}

export function WorkflowStepView({ step }: WorkflowStepViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    if (!step.promptTemplate) return;
    navigator.clipboard.writeText(step.promptTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative pl-10 pb-10 border-l-2 border-indigo-100 dark:border-indigo-950 last:border-l-transparent last:pb-0">
      {/* Step Circle Indicator */}
      <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-indigo-600/30">
        {step.stepNumber}
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {step.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Est. {step.estimatedTime}</span>
          </div>
        </div>

        {/* Explanation & Action */}
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            <InlineMarkdown text={step.explanation} />
          </p>
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <span className="font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block mb-1">
              Required Action:
            </span>
            <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium">
              <InlineMarkdown text={step.action} />
            </p>
          </div>
        </div>

        {/* Tool Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {step.recommendedToolName && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Recommended Tool
                </span>
                {step.recommendedToolSlug ? (
                  <Link
                    href={`/tools/${step.recommendedToolSlug}`}
                    className="font-bold text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {step.recommendedToolName}
                  </Link>
                ) : (
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {step.recommendedToolName}
                  </span>
                )}
              </div>
              {step.recommendedToolSlug && (
                <Link
                  href={`/tools/${step.recommendedToolSlug}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="View Tool Review"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}

          {step.alternativeTools && step.alternativeTools.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Free Alternatives
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {step.alternativeTools.map((alt) => (
                  <span
                    key={alt}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Why it Helps */}
        <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
          <span>
            <strong className="text-slate-700 dark:text-slate-300">Why it helps: </strong>
            <InlineMarkdown text={step.whyItHelps} />
          </span>
        </div>

        {/* Prompt Template (if available) */}
        {step.promptTemplate && (
          <div className="mt-3 p-3.5 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-sans">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Ready-to-use Prompt Template</span>
              </span>
              <button
                onClick={handleCopyPrompt}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="font-sans">{copied ? "Copied!" : "Copy Prompt"}</span>
              </button>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-indigo-200">
              {step.promptTemplate}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
