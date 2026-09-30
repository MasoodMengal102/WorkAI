import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dataService } from "@/lib/db";
import { HelpfulFeedback } from "@/components/feedback/HelpfulFeedback";
import { InArticleAd, BottomAd } from "@/components/ads/AdSlot";
import { GitCompare, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comparison = await dataService.getComparisonBySlug(params.slug);
  if (!comparison) return { title: "Comparison Not Found" };

  return {
    title: `${comparison.title} — Verified Feature & Pricing Breakdown`,
    description: comparison.summary,
  };
}

export default async function ComparisonDetailPage({ params }: Props) {
  const [comparison, allTools] = await Promise.all([
    dataService.getComparisonBySlug(params.slug),
    dataService.getTools(),
  ]);

  if (!comparison) {
    notFound();
  }

  const toolA = allTools.find((t) => t.slug === comparison.toolASlug);
  const toolB = allTools.find((t) => t.slug === comparison.toolBSlug);

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 dark:text-slate-400">Home</Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-slate-900 dark:text-slate-400">Comparisons</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-medium">{comparison.title}</span>
        </nav>

        {/* Overview Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Head-to-Head Comparison</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {comparison.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {comparison.summary}
          </p>
        </div>

        {/* Side-by-Side Metadata Cards */}
        {toolA && toolB && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tool A Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <Link href={`/tools/${toolA.slug}`} className="text-xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition">
                  {toolA.name}
                </Link>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {toolA.pricingStatus}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {toolA.description}
              </p>
              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p><strong>Free Allowance:</strong> {toolA.freeAvailability}</p>
                <p><strong>Platforms:</strong> {toolA.platforms.join(", ")}</p>
                <p><strong>Commercial Use:</strong> {toolA.commercialUse}</p>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <Link href={`/tools/${toolA.slug}`} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Full Editorial Review →
                </Link>
                <a
                  href={`/go/${toolA.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1"
                >
                  <span>Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Tool B Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <Link href={`/tools/${toolB.slug}`} className="text-xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition">
                  {toolB.name}
                </Link>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {toolB.pricingStatus}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {toolB.description}
              </p>
              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p><strong>Free Allowance:</strong> {toolB.freeAvailability}</p>
                <p><strong>Platforms:</strong> {toolB.platforms.join(", ")}</p>
                <p><strong>Commercial Use:</strong> {toolB.commercialUse}</p>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <Link href={`/tools/${toolB.slug}`} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Full Editorial Review →
                </Link>
                <a
                  href={`/go/${toolB.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1"
                >
                  <span>Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        <InArticleAd />

        {/* Key Differences */}
        <section className="mt-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Key Architectural & Workflow Differences
          </h2>
          <ul className="space-y-3">
            {comparison.keyDifferences.map((diff, i) => (
              <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{diff}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Strengths & Limitations Matrix */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Where {comparison.toolAName} Shines</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {comparison.strengthsA.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Where {comparison.toolBName} Shines</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {comparison.strengthsB.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Limitations */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{comparison.toolAName} Limitations</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {comparison.limitationsA.map((lim, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{comparison.toolBName} Limitations</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {comparison.limitationsB.map((lim, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Objective Verdict (Requirement 16 & 24: No Fake Winner) */}
        <section className="mt-8 p-6 sm:p-8 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Editorial Verdict & Workflow Fit
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {comparison.verdict}
          </p>
        </section>

        <HelpfulFeedback pagePath={`/compare/${comparison.slug}`} entityType="COMPARISON" entityId={comparison.id} />

        <BottomAd />
      </div>
    </div>
  );
}
