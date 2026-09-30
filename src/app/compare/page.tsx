import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { dataService } from "@/lib/db";
import { GitCompare, ArrowRight, CheckCircle2 } from "lucide-react";
import { TopAd, BottomAd } from "@/components/ads/AdSlot";
import { InlineMarkdown } from "@/components/content/MarkdownRenderer";

export const metadata: Metadata = {
  title: "Objective AI Tool Comparisons (10+ Head-to-Head Showdowns)",
  description: "Compare top AI tools side-by-side without fabricated benchmarks or universal winner declarations. Clear trade-offs, pricing differences, and use case fits.",
};

export default async function ComparisonsIndexPage() {
  const comparisons = await dataService.getComparisons();

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 mb-4">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Objective Head-to-Head Comparisons</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Tool Comparisons
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            No universal winner declarations. Factual, side-by-side analysis of features, limitations, and pricing so you can select what fits your specific workflow.
          </p>
        </div>

        <TopAd />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparisons.map((comp) => (
            <Link
              key={comp.slug}
              href={`/compare/${comp.slug}`}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {comp.toolAName}
                  </span>
                  <span className="text-xs font-bold text-slate-400">VS</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {comp.toolBName}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {comp.title}
                </h2>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  <InlineMarkdown text={comp.summary} />
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  {comp.keyDifferences.slice(0, 2).map((diff, i) => (
                    <div key={i} className="text-xs text-slate-500 flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                      <span className="line-clamp-1"><InlineMarkdown text={diff} /></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>View Full Comparison</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <BottomAd />
      </div>
    </div>
  );
}
