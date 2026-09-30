"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, ShieldAlert, BookOpen, Layers, ExternalLink, Loader2 } from "lucide-react";
import { GoalAnalysisResult } from "@/types";
import { InlineMarkdown } from "@/components/content/MarkdownRenderer";

export function GoalPrompt() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GoalAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    "I want to create YouTube videos",
    "I want to create a professional CV",
    "I want to start a business",
    "I want to learn Python",
    "I want to create Instagram content",
    "I want to automate repetitive work",
  ];

  const handleAnalyze = async (inputGoal?: string) => {
    const targetGoal = inputGoal || goal;
    if (!targetGoal.trim()) return;

    setLoading(true);
    setError(null);
    if (inputGoal) setGoal(inputGoal);

    try {
      const res = await fetch("/api/ai-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: targetGoal }),
      });

      if (!res.ok) {
        throw new Error(`Failed to analyze goal: HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
      } else {
        throw new Error(data.error || "Unable to analyze goal");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while analyzing your goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input Box */}
      <div className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyze();
          }}
          className="flex flex-col sm:flex-row items-stretch gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What are you trying to accomplish? (e.g. I want to create YouTube videos)"
              className="w-full h-14 pl-5 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base font-normal transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !goal.trim()}
            className="h-14 px-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing Goal...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Build My Workflow</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Prompts */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium mr-1 text-slate-700 dark:text-slate-300">Try asking:</span>
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleAnalyze(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to complete analysis</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Result Cards Display */}
      {result && (
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-fadeIn">
          {/* Header Summary */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                Category: {result.category}
              </span>
              {result.subcategory && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {result.subcategory}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                Level: {result.experienceLevel}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Understood:
            </h3>
            <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {result.understoodGoal}
            </p>
          </div>

          {/* Workflow Steps */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Recommended Action Workflow</span>
              </h4>
              <span className="text-xs text-slate-500">Step-by-Step Blueprint</span>
            </div>

            <div className="space-y-3">
              {result.workflow.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 flex items-start gap-4"
                >
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {step.title}
                      </h5>
                      {step.toolName && (
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                          {step.toolName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      <InlineMarkdown text={step.action} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Free Options */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Free / Freemium Tools for this Goal</span>
              </h4>
              <Link href="/tools" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                View all 50+ tools →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.freeOptions.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {tool.name}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {tool.pricingStatus}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Verified: {tool.lastVerifiedAt}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">Read Review →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Built-In Free AI Services */}
          {result.builtInServices.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Free Built-In Platform Utilities</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.builtInServices.map((srv) => (
                  <Link
                    key={srv.slug}
                    href={`/ai-services/${srv.slug}`}
                    className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">{srv.name}</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{srv.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Guides */}
          {result.relatedGuides.length > 0 && (
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Recommended Practical Guides</span>
              </h4>
              <div className="space-y-2">
                {result.relatedGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{guide.title}</span>
                    <span className="text-slate-500 flex-shrink-0 ml-3">{guide.readTime} read →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
